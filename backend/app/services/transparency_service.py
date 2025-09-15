from typing import Dict, List, Any, Optional
import random
from datetime import datetime
from app.schemas.transparency import TransparencyMetricsResponse

class TransparencyService:
    """Service for calculating government transparency metrics and scores"""
    
    def __init__(self):
        self.transparency_weights = {
            'data_availability': 0.3,
            'timeliness': 0.25,
            'completeness': 0.2,
            'accessibility': 0.15,
            'accuracy': 0.1
        }
    
    def calculate_transparency_score(self, budget_data: Dict[str, Any]) -> float:
        """
        Calculate transparency score based on budget data quality and availability
        
        Args:
            budget_data: Dictionary containing budget information
            
        Returns:
            float: Transparency score between 0.0 and 1.0
        """
        try:
            # Initialize base score
            score = 0.0
            
            # Data Availability Score (0.3 weight)
            data_availability = self._calculate_data_availability_score(budget_data)
            score += data_availability * self.transparency_weights['data_availability']
            
            # Timeliness Score (0.25 weight)
            timeliness = self._calculate_timeliness_score(budget_data)
            score += timeliness * self.transparency_weights['timeliness']
            
            # Completeness Score (0.2 weight)
            completeness = self._calculate_completeness_score(budget_data)
            score += completeness * self.transparency_weights['completeness']
            
            # Accessibility Score (0.15 weight)
            accessibility = self._calculate_accessibility_score(budget_data)
            score += accessibility * self.transparency_weights['accessibility']
            
            # Accuracy Score (0.1 weight)
            accuracy = self._calculate_accuracy_score(budget_data)
            score += accuracy * self.transparency_weights['accuracy']
            
            # Ensure score is between 0 and 1
            return max(0.0, min(1.0, score))
            
        except Exception as e:
            print(f"Error calculating transparency score: {e}")
            return 0.5  # Return neutral score on error
    
    def _calculate_data_availability_score(self, budget_data: Dict[str, Any]) -> float:
        """Calculate score based on data availability"""
        if not budget_data:
            return 0.2
        
        # Check for key budget components
        key_fields = ['total_allocation', 'ministries', 'sectors', 'expenditure']
        available_fields = sum(1 for field in key_fields if field in budget_data and budget_data[field])
        
        return available_fields / len(key_fields)
    
    def _calculate_timeliness_score(self, budget_data: Dict[str, Any]) -> float:
        """Calculate score based on data timeliness"""
        # Mock timeliness calculation - in real implementation, would check last_updated dates
        return random.uniform(0.6, 0.9)
    
    def _calculate_completeness_score(self, budget_data: Dict[str, Any]) -> float:
        """Calculate score based on data completeness"""
        if not budget_data:
            return 0.3
        
        # Check completeness of data
        completeness_indicators = 0
        total_indicators = 4
        
        # Check if budget has ministry-wise breakdown
        if 'ministries' in budget_data and len(budget_data.get('ministries', [])) > 5:
            completeness_indicators += 1
        
        # Check if budget has sector-wise data
        if 'sectors' in budget_data and len(budget_data.get('sectors', [])) > 3:
            completeness_indicators += 1
        
        # Check if expenditure data is available
        if 'expenditure' in budget_data and budget_data['expenditure']:
            completeness_indicators += 1
        
        # Check if allocation data is available
        if 'total_allocation' in budget_data and budget_data['total_allocation']:
            completeness_indicators += 1
        
        return completeness_indicators / total_indicators
    
    def _calculate_accessibility_score(self, budget_data: Dict[str, Any]) -> float:
        """Calculate score based on data accessibility"""
        # Mock accessibility score - in real implementation, would check format, API availability, etc.
        return random.uniform(0.7, 0.95)
    
    def _calculate_accuracy_score(self, budget_data: Dict[str, Any]) -> float:
        """Calculate score based on data accuracy"""
        # Mock accuracy score - in real implementation, would validate data consistency
        return random.uniform(0.75, 0.9)
    
    def calculate_comprehensive_metrics(self) -> Dict[str, Any]:
        """
        Calculate comprehensive transparency metrics across government
        
        Returns:
            Dict containing detailed transparency metrics
        """
        try:
            # Generate mock comprehensive metrics
            current_time = datetime.now()
            
            metrics = {
                'overall_transparency_score': round(random.uniform(0.65, 0.85), 3),
                'data_availability_index': round(random.uniform(0.7, 0.9), 3),
                'government_responsiveness': round(random.uniform(0.6, 0.8), 3),
                'information_quality': round(random.uniform(0.75, 0.95), 3),
                
                # Ministry-wise transparency scores
                'ministry_scores': {
                    'Ministry of Finance': round(random.uniform(0.8, 0.95), 3),
                    'Ministry of Health': round(random.uniform(0.7, 0.85), 3),
                    'Ministry of Education': round(random.uniform(0.75, 0.9), 3),
                    'Ministry of Defence': round(random.uniform(0.5, 0.7), 3),
                    'Ministry of Agriculture': round(random.uniform(0.65, 0.8), 3),
                    'Ministry of Railways': round(random.uniform(0.6, 0.8), 3),
                    'Ministry of Rural Development': round(random.uniform(0.7, 0.85), 3),
                    'Ministry of External Affairs': round(random.uniform(0.55, 0.75), 3)
                },
                
                # Sector-wise transparency
                'sector_transparency': {
                    'Healthcare': round(random.uniform(0.7, 0.85), 3),
                    'Education': round(random.uniform(0.75, 0.9), 3),
                    'Infrastructure': round(random.uniform(0.6, 0.8), 3),
                    'Agriculture': round(random.uniform(0.65, 0.8), 3),
                    'Defense': round(random.uniform(0.45, 0.65), 3),
                    'Social Welfare': round(random.uniform(0.7, 0.85), 3)
                },
                
                # Trend data
                'monthly_trends': [
                    {'month': 'Jan 2024', 'score': round(random.uniform(0.6, 0.8), 3)},
                    {'month': 'Feb 2024', 'score': round(random.uniform(0.62, 0.82), 3)},
                    {'month': 'Mar 2024', 'score': round(random.uniform(0.64, 0.84), 3)},
                    {'month': 'Apr 2024', 'score': round(random.uniform(0.66, 0.86), 3)},
                    {'month': 'May 2024', 'score': round(random.uniform(0.68, 0.88), 3)},
                    {'month': 'Jun 2024', 'score': round(random.uniform(0.65, 0.85), 3)}
                ],
                
                # Key indicators
                'key_indicators': {
                    'total_datasets_available': random.randint(150, 250),
                    'datasets_updated_monthly': random.randint(80, 120),
                    'citizen_requests_resolved': f"{random.randint(75, 95)}%",
                    'average_response_time': f"{random.randint(5, 15)} days",
                    'data_formats_supported': ['JSON', 'CSV', 'XML', 'PDF'],
                    'api_uptime': f"{random.uniform(95, 99.5):.1f}%"
                },
                
                # Recommendations
                'recommendations': [
                    "Improve data standardization across ministries",
                    "Implement real-time budget tracking systems",
                    "Enhance citizen feedback mechanisms",
                    "Increase frequency of data updates",
                    "Expand multilingual data accessibility"
                ],
                
                'last_updated': current_time.isoformat(),
                'calculation_method': 'Weighted Average of Multiple Transparency Indicators'
            }
            
            return metrics
            
        except Exception as e:
            print(f"Error calculating comprehensive metrics: {e}")
            return {
                'overall_transparency_score': 0.5,
                'error': 'Failed to calculate metrics',
                'last_updated': datetime.now().isoformat()
            }
    
    def get_transparency_grade(self, score: float) -> str:
        """
        Convert transparency score to letter grade
        
        Args:
            score: Transparency score (0.0 to 1.0)
            
        Returns:
            str: Letter grade (A+ to F)
        """
        if score >= 0.9:
            return 'A+'
        elif score >= 0.8:
            return 'A'
        elif score >= 0.7:
            return 'B+'
        elif score >= 0.6:
            return 'B'
        elif score >= 0.5:
            return 'C+'
        elif score >= 0.4:
            return 'C'
        elif score >= 0.3:
            return 'D'
        else:
            return 'F'
    
    def get_improvement_suggestions(self, score: float) -> List[str]:
        """
        Get suggestions for improving transparency based on current score
        
        Args:
            score: Current transparency score
            
        Returns:
            List of improvement suggestions
        """
        suggestions = []
        
        if score < 0.5:
            suggestions.extend([
                "Establish basic data publication standards",
                "Create centralized data portal",
                "Implement regular data update schedules"
            ])
        
        if score < 0.7:
            suggestions.extend([
                "Improve data quality and completeness",
                "Enhance citizen access to information",
                "Standardize data formats across departments"
            ])
        
        if score < 0.9:
            suggestions.extend([
                "Implement real-time data publishing",
                "Add advanced search and filtering capabilities",
                "Provide data visualization tools"
            ])
        
        return suggestions[:5]  # Return top 5 suggestions
