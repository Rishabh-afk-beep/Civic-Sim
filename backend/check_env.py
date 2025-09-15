# Backend Environment Verification Script
# Add this to your backend root directory as check_env.py

import os
from dotenv import load_dotenv
import google.generativeai as genai

def check_environment():
    """Verify all required environment variables are set"""
    load_dotenv()

    print("🔍 ENVIRONMENT VERIFICATION")
    print("=" * 40)

    # Check required variables
    required_vars = {
        'GEMINI_API_KEY': 'Gemini API key for document analysis',
        'SECRET_KEY': 'JWT secret key for authentication',
        'CORS_ORIGINS': 'Allowed frontend origins'
    }

    missing_vars = []

    for var, description in required_vars.items():
        value = os.getenv(var)
        if value:
            print(f"✅ {var}: {'*' * min(len(value), 20)} ({description})")
        else:
            print(f"❌ {var}: MISSING - {description}")
            missing_vars.append(var)

    # Test Gemini API
    gemini_key = os.getenv('GEMINI_API_KEY')
    if gemini_key:
        try:
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-pro')
            test_response = model.generate_content("Test message")
            print("✅ GEMINI_API_KEY: Working correctly")
        except Exception as e:
            print(f"❌ GEMINI_API_KEY: Invalid or not working - {e}")
            missing_vars.append('GEMINI_API_KEY (invalid)')

    print(f"\n📊 SUMMARY:")
    if not missing_vars:
        print("✅ All environment variables are properly configured!")
        return True
    else:
        print(f"❌ Missing/Invalid variables: {', '.join(missing_vars)}")
        print("\n🔧 TO FIX:")
        print("1. Create .env file in backend root directory")
        print("2. Add missing variables:")
        for var in missing_vars:
            if 'GEMINI' in var:
                print(f"   {var}=your-gemini-api-key-from-google-ai-studio")
            elif 'SECRET' in var:
                print(f"   {var}=your-super-secret-jwt-key-here")
            elif 'CORS' in var:
                print(f"   {var}=http://localhost:3000,https://your-frontend.vercel.app")
        return False

if __name__ == "__main__":
    check_environment()
