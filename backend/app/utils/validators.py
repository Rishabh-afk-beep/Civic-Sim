from typing import Any, Dict, List, Optional
import re
from datetime import datetime

class InputValidator:
    """Utility class for input validation"""
    
    @staticmethod
    def validate_file_size(size: int, max_size: int = 10 * 1024 * 1024) -> bool:
        """Validate file size"""
        return 0 < size <= max_size
    
    @staticmethod
    def validate_file_type(content_type: str, allowed_types: List[str]) -> bool:
        """Validate file content type"""
        return content_type in allowed_types
    
    @staticmethod
    def validate_percentage(value: float) -> bool:
        """Validate percentage value (0-100)"""
        return 0 <= value <= 100
    
    @staticmethod
    def validate_rating(value: float) -> bool:
        """Validate rating value (1-5)"""
        return 1 <= value <= 5
    
    @staticmethod
    def validate_text_length(text: str, min_length: int = 1, max_length: int = 10000) -> bool:
        """Validate text length"""
        return min_length <= len(text.strip()) <= max_length
    
    @staticmethod
    def validate_email_format(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_document_type(doc_type: str) -> bool:
        """Validate document type"""
        allowed_types = [
            'government_announcement',
            'budget_document', 
            'policy_statement',
            'procurement_notice',
            'legislation',
            'public_notice'
        ]
        return doc_type in allowed_types
    
    @staticmethod
    def validate_simulation_scenario(scenario: str) -> bool:
        """Validate simulation scenario name"""
        allowed_scenarios = [
            'education_subsidy_increase',
            'healthcare_infrastructure_expansion',
            'agricultural_support_program',
            'social_welfare_enhancement',
            'infrastructure_development'
        ]
        return scenario in allowed_scenarios
    
    @staticmethod
    def validate_feedback_type(feedback_type: str) -> bool:
        """Validate feedback type"""
        allowed_types = ['bug', 'feature', 'general', 'rating', 'improvement']
        return feedback_type in allowed_types
    
    @staticmethod
    def sanitize_html(text: str) -> str:
        """Basic HTML sanitization"""
        import html
        # Escape HTML characters
        sanitized = html.escape(text)
        # Remove any remaining script tags
        sanitized = re.sub(r'<script.*?</script>', '', sanitized, flags=re.IGNORECASE | re.DOTALL)
        return sanitized
    
    @staticmethod
    def validate_user_role(role: str) -> bool:
        """Validate user role"""
        allowed_roles = ['citizen', 'researcher', 'journalist', 'admin']
        return role in allowed_roles

# Instance for easy importing
validator = InputValidator()