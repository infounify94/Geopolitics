import os
from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.")
    exit(1)

supabase: Client = create_client(url, key)

with open('schema.sql', 'r', encoding='utf-8') as f:
    sql = f.read()

try:
    # Supabase Python SDK doesn't have a direct 'execute raw SQL' method that isn't RPC.
    # Because this is a complex schema file, we'll try to execute it as a query via REST API or RPC,
    # but the python client doesn't support raw DDL execution easily without an RPC function.
    print("WARNING: The Python Supabase client cannot execute raw DDL (CREATE TABLE) scripts directly.")
    print("Please use the Supabase web dashboard SQL Editor to run schema.sql.")
except Exception as e:
    print(f"Error: {e}")
