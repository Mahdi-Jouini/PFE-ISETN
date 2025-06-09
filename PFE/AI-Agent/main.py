from sqlalchemy import create_engine, text, inspect
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

DB_USERNAME = "pfe_user"
DB_PASSWORD = "PfePassword123"
DB_SERVER = "localhost"
DB_PORT = 1433
DB_NAME = "pfe_db"

model = OllamaLLM(model="llama3.2")

# Database connection (SQL Server)
connection_url = f"mssql+pyodbc://{DB_USERNAME}:{DB_PASSWORD}@{DB_SERVER}:{DB_PORT}/{DB_NAME}?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes"
engine = create_engine(connection_url)

try:
    with engine.connect() as conn:
        print("Successfully connected to SQL Server")
except Exception as e:
    print(f"Database connection failed: {e}")
    exit(1)

# Create the inspector
inspector = inspect(engine)
# Get all table names
tables = inspector.get_table_names()


# Function to get database schema information
def get_schema_info():
    schema_info = "Database Tables and Columns:\n\n"

    for table_name in tables:
        schema_info += f"Table: {table_name}\n"
        columns = inspector.get_columns(table_name)

        for column in columns:
            column_name = column['name']
            column_type = str(column['type'])
            nullable = "NULL" if column['nullable'] else "NOT NULL"
            schema_info += f"  - {column_name}: {column_type} ({nullable})\n"

        schema_info += "\n"

    return schema_info


# Get the schema information
schema_info = get_schema_info()
print("Database Schema:")
print(schema_info)

# Create the prompt template
template = """
You are a SQL expert. Generate a precise SQL query based on the database schema and user question.

Database Schema:
{schema_info}

User Question: {question}

Instructions:
- Generate ONLY the SQL query, no explanations
- Use proper SQL syntax for SQL Server
- Include appropriate JOINs when querying multiple tables
- Use proper column names and table names from the schema
- Add WHERE clauses when filtering is needed
- Use GROUP BY and aggregate functions when appropriate
- Ensure the query is syntactically correct and executable

SQL Query:
"""

prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model


# Function to generate SQL query
def generate_sql_query(question):
    response = chain.invoke({
        "schema_info": schema_info,
        "question": question
    })
    return response


# Example usage
if __name__ == "__main__":
    # Test with a sample question
    user_question = "Show me all records from the first table"

    print(f"Question: {user_question}")
    print("Generated SQL Query:")
    sql_query = generate_sql_query(user_question)
    print(sql_query)