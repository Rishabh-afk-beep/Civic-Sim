import uuid
import hashlib
from datetime import datetime
from typing import Any, Dict, List
import json

def generate_unique_id() -> str:
    """Generate a unique identifier"""
    return str(uuid.uuid4())

def hash_string(value: str) -> str:
    """Generate SHA-256 hash of a string"""
    return hashlib.sha256(value.encode()).hexdigest()

def format_currency(amount: float, currency: str = "USD") -> str:
    """Format currency amount"""
    if currency == "USD":
        return f"${amount:,.2f}"
    elif currency == "INR":
        return f"₹{amount:,.2f}"
    else:
        return f"{amount:,.2f} {currency}"

def format_percentage(value: float, decimal_places: int = 2) -> str:
    """Format percentage value"""
    return f"{value:.{decimal_places}f}%"

def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    import re
    # Remove or replace unsafe characters
    safe_filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    return safe_filename[:255]  # Limit length

def calculate_transparency_score(delivery_rate: float, disclosure_score: float, accessibility_score: float) -> float:
    """Calculate overall transparency score"""
    # Weighted average: delivery 40%, disclosure 35%, accessibility 25%
    score = (delivery_rate * 0.4) + (disclosure_score * 0.35) + (accessibility_score * 0.25)
    return min(100.0, max(0.0, score))

def format_time_duration(seconds: float) -> str:
    """Format time duration in human-readable format"""
    if seconds < 1:
        return f"{seconds*1000:.0f}ms"
    elif seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        minutes = seconds // 60
        remaining_seconds = seconds % 60
        return f"{minutes:.0f}m {remaining_seconds:.0f}s"
    else:
        hours = seconds // 3600
        remaining_minutes = (seconds % 3600) // 60
        return f"{hours:.0f}h {remaining_minutes:.0f}m"

def paginate_results(items: List[Any], page: int, per_page: int) -> Dict[str, Any]:
    """Paginate a list of items"""
    total_items = len(items)
    total_pages = (total_items + per_page - 1) // per_page
    start_index = (page - 1) * per_page
    end_index = start_index + per_page
    
    return {
        "items": items[start_index:end_index],
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total_items": total_items,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }

def safe_json_loads(json_string: str, default: Any = None) -> Any:
    """Safely parse JSON string"""
    try:
        return json.loads(json_string)
    except (json.JSONDecodeError, TypeError):
        return default

def validate_email(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None