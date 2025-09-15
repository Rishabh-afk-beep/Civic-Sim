import sqlite3
import json
from datetime import datetime, timedelta

def create_database():
    """Create and populate the CivicSim database"""

    # Connect to database
    conn = sqlite3.connect('civicsim.db')
    cursor = conn.cursor()

    print("Creating CivicSim database tables...")

    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firebase_uid TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            display_name TEXT,
            role TEXT DEFAULT 'citizen',
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create documents table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            document_type TEXT NOT NULL,
            verdict TEXT,
            confidence_score REAL,
            ai_analysis TEXT,
            suspicious_elements JSON,
            metadata_check TEXT,
            processing_status TEXT DEFAULT 'pending',
            processing_time REAL,
            error_message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Create policy_simulations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS policy_simulations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            scenario_name TEXT NOT NULL,
            parameters JSON NOT NULL,
            predicted_outcomes JSON NOT NULL,
            ai_explanation TEXT,
            confidence_level TEXT DEFAULT 'medium',
            assumptions JSON,
            simulation_version TEXT DEFAULT '1.0',
            processing_time REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Create feedback table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            feedback_type TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            rating REAL,
            page_url TEXT,
            user_agent TEXT,
            status TEXT DEFAULT 'open',
            admin_response TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    print("✅ Database tables created successfully")

    # Insert sample data
    print("Inserting sample data...")

    # Sample users
    sample_users = [
        ('demo_user_1', 'demo@civicsim.com', 'Demo User', 'citizen'),
        ('admin_user_1', 'admin@civicsim.com', 'Admin User', 'admin'),
        ('researcher_1', 'researcher@civicsim.com', 'Research User', 'researcher')
    ]

    for firebase_uid, email, display_name, role in sample_users:
        cursor.execute('''
            INSERT OR IGNORE INTO users (firebase_uid, email, display_name, role)
            VALUES (?, ?, ?, ?)
        ''', (firebase_uid, email, display_name, role))

    # Sample documents
    sample_documents = [
        (1, 'sample_budget_2024.pdf', 'application/pdf', 2048576, 'budget_document', 
         'verified', 94.5, 'Document appears authentic with consistent formatting.', 
         '[]', 'passed', 'completed', 2.3),
        (1, 'policy_announcement.pdf', 'application/pdf', 1024768, 'government_announcement',
         'suspicious', 76.2, 'Some inconsistencies found in metadata patterns.',
         '["Metadata timestamp mismatch"]', 'review_needed', 'completed', 3.1)
    ]

    for doc_data in sample_documents:
        cursor.execute('''
            INSERT OR IGNORE INTO documents 
            (user_id, filename, file_type, file_size, document_type, verdict, 
             confidence_score, ai_analysis, suspicious_elements, metadata_check, 
             processing_status, processing_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', doc_data)

    # Commit changes
    conn.commit()
    conn.close()

    print("✅ Sample data inserted successfully")
    print("🎉 Database setup complete!")
    print("\nDatabase file: civicsim.db")
    print("Sample users created:")
    print("  - demo@civicsim.com (citizen)")
    print("  - admin@civicsim.com (admin)") 
    print("  - researcher@civicsim.com (researcher)")

if __name__ == "__main__":
    create_database()