import google.generativeai as genai
from typing import Dict, Any, Optional
import json
import logging
from app.config import get_settings
from app.utils.exceptions import AIServiceException

settings = get_settings()
logger = logging.getLogger(__name__)

class MockAIService:
    """Fallback mock service when Gemini fails"""
    
    async def analyze_document_authenticity(self, text_content: str, document_type: str) -> Dict[str, Any]:
        text_lower = (text_content or "").lower()
        
        # Simple keyword-based analysis
        official_keywords = ["official", "government", "ministry", "department", "notification", "circular"]
        suspicious_indicators = ["urgent", "click here", "limited time", "act now"]
        
        has_official_keywords = any(keyword in text_lower for keyword in official_keywords)
        has_suspicious_indicators = any(indicator in text_lower for indicator in suspicious_indicators)
        
        if has_official_keywords and not has_suspicious_indicators:
            verdict = "verified"
            confidence = 75.0
        elif has_suspicious_indicators:
            verdict = "suspicious"
            confidence = 30.0
        else:
            verdict = "inconclusive"
            confidence = 50.0
        
        return {
            "verdict": verdict,
            "confidence_score": confidence,
            "explanation": f"Mock analysis for {document_type}: Document shows {'positive' if verdict == 'verified' else 'concerning' if verdict == 'suspicious' else 'mixed'} indicators. This is a fallback response when AI service is unavailable.",
            "suspicious_elements": ["Informal language patterns"] if verdict == "suspicious" else [],
            "authenticity_indicators": ["Official terminology detected"] if verdict == "verified" else [],
            "recommendations": "Configure a real AI service (Gemini/OpenAI) for accurate analysis. This is a mock response.",
            "processing_metadata": {
                "provider": "mock",
                "model_used": "fallback-analyzer",
                "analysis_type": "document_authenticity"
            }
        }

    async def explain_policy_simulation(self, scenario_name: str, parameters: Dict[str, Any], outcomes: Dict[str, Any]) -> str:
        return f"Mock explanation for {scenario_name}: This simulation shows potential outcomes. Fallback response - configure AI service for detailed analysis."

class GeminiAIService:
    def __init__(self):
        try:
            if not settings.GEMINI_API_KEY:
                raise ValueError("GEMINI_API_KEY not configured")
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
            self.available = True
            logger.info(f"Gemini AI service initialized with model: {settings.GEMINI_MODEL}")
        except Exception as e:
            logger.warning(f"Failed to initialize Gemini AI: {e}")
            self.available = False
    
    async def analyze_document_authenticity(self, text_content: str, document_type: str) -> Dict[str, Any]:
        """Analyze document for authenticity using Gemini AI"""
        if not self.available:
            raise AIServiceException("Gemini AI service not available")
            
        try:
            prompt = f"""
            Analyze this {document_type} document for authenticity indicators.
            
            IMPORTANT: You are an AI assistant helping with document verification for educational purposes.
            Your analysis is probabilistic and should not be considered definitive proof.
            
            Document Text (first 2000 characters):
            {text_content[:2000]}
            
            Please provide a JSON response with:
            {{
                "verdict": "verified" | "suspicious" | "inconclusive",
                "confidence_score": <number between 0-100>,
                "explanation": "<detailed analysis>",
                "suspicious_elements": [<list of specific concerns or empty list>],
                "authenticity_indicators": [<list of positive indicators>],
                "recommendations": "<what users should do next>"
            }}
            
            Consider:
            - Language patterns and consistency
            - Formatting and structure
            - Typical characteristics of official documents
            - Any obvious inconsistencies or red flags
            
            Remember to emphasize that this is AI-assisted analysis and encourage human verification.
            """
            
            response = self.model.generate_content(prompt)
            
            # Parse JSON response
            try:
                result = json.loads(response.text)
                
                # Add processing metadata
                result["processing_metadata"] = {
                    "model_used": settings.GEMINI_MODEL,
                    "provider": "gemini",
                    "analysis_type": "document_authenticity",
                    "disclaimer": "This is AI-assisted analysis for educational purposes only. Human verification recommended for critical decisions."
                }
                
                return result
                
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                return {
                    "verdict": "inconclusive",
                    "confidence_score": 50.0,
                    "explanation": response.text,
                    "suspicious_elements": [],
                    "authenticity_indicators": [],
                    "recommendations": "Unable to parse structured analysis. Please consult human experts.",
                    "processing_metadata": {
                        "model_used": settings.GEMINI_MODEL,
                        "provider": "gemini",
                        "analysis_type": "document_authenticity",
                        "error": "JSON parsing failed"
                    }
                }
                
        except Exception as e:
            logger.error(f"Gemini AI analysis failed: {e}")
            raise AIServiceException(f"Gemini AI analysis failed: {str(e)}")
    
    async def explain_policy_simulation(self, scenario_name: str, parameters: Dict[str, Any], outcomes: Dict[str, Any]) -> str:
        """Generate AI explanation for policy simulation results"""
        if not self.available:
            raise AIServiceException("Gemini AI service not available")
            
        try:
            prompt = f"""
            You are an AI policy analysis assistant helping citizens understand potential policy impacts.
            
            IMPORTANT LIMITATIONS:
            - These are simplified projections based on mathematical models
            - Real-world outcomes may vary significantly due to unforeseen factors
            - This tool is for educational and exploratory purposes only
            - Policy decisions should involve comprehensive expert analysis
            
            Policy Scenario: {scenario_name}
            Input Parameters: {json.dumps(parameters, indent=2)}
            Predicted Outcomes: {json.dumps(outcomes, indent=2)}
            
            Please provide a clear, accessible explanation (200-300 words) that:
            1. Summarizes the key predicted impacts
            2. Explains the reasoning behind the projections
            3. Highlights potential positive outcomes
            4. Mentions possible risks and challenges
            5. Emphasizes uncertainty and the need for expert consultation
            6. Uses language accessible to general citizens
            
            Focus on helping citizens understand complex policy concepts while being transparent about limitations.
            """
            
            response = self.model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            logger.error(f"Policy explanation failed: {e}")
            raise AIServiceException(f"Policy explanation failed: {str(e)}")

class AIServiceWithFallback:
    """Service that tries Gemini first, falls back to mock"""
    
    def __init__(self):
        self.gemini_service = GeminiAIService()
        self.mock_service = MockAIService()
        
    async def analyze_document_authenticity(self, text_content: str, document_type: str) -> Dict[str, Any]:
        # Try Gemini first
        if self.gemini_service.available:
            try:
                return await self.gemini_service.analyze_document_authenticity(text_content, document_type)
            except Exception as e:
                logger.warning(f"Gemini failed, falling back to mock: {e}")
        
        # Fall back to mock
        return await self.mock_service.analyze_document_authenticity(text_content, document_type)
    
    async def explain_policy_simulation(self, scenario_name: str, parameters: Dict[str, Any], outcomes: Dict[str, Any]) -> str:
        # Try Gemini first
        if self.gemini_service.available:
            try:
                return await self.gemini_service.explain_policy_simulation(scenario_name, parameters, outcomes)
            except Exception as e:
                logger.warning(f"Gemini failed, falling back to mock: {e}")
        
        # Fall back to mock
        return await self.mock_service.explain_policy_simulation(scenario_name, parameters, outcomes)

# Initialize service instance with fallback
ai_service = AIServiceWithFallback()