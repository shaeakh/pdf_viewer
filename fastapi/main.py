from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

from openai import OpenAI
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
# Initialize OpenAI client with environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Text(BaseModel):
    text: str
    explainType: str

@app.get("/")
def get():
    return {"msg": "Hello"}

@app.post("/help")
async def help_explain(text: Text):
    prompt = f"Explain the following text in simple language with examples if possible. Use the method: {text.explainType}\n\nText: {text.text}"
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant who explains complex text simply."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,  # Adjust based on your needs
            temperature=0.7,  # Controls creativity
        )

        explanation = response.choices[0].message.content
        return {"explanation": explanation}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error from OpenAI API: {str(e)}")