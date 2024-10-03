# import pandas as pd 

from typing import List, Union

from fastapi import Depends, FastAPI, HTTPException
from fastapi_pagination import Page, add_pagination, paginate
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine, Float
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import select
from fastapi_pagination.ext.sqlalchemy import paginate

from models import Transactions, Base
from database import SessionLocal, engine
from schemas import Transaction

import pandas as pd 


import os 
from dotenv import load_dotenv
load_dotenv()




# engine = create_engine(os.getenv('DB_URI') , echo=True)




# Base.metadata.create_all(bind=engine)

# data = pd.read_csv('Credit.csv', index_col=0)
# data.rename(columns={'Transaction Date': 'transaction_date', 'Description': 'description','Amount': 'amount','Category': 'category','Bank': 'bank'}, inplace=True)
# data.to_sql('transactions', con=engine, if_exists='append', index=True, index_label='id', dtype={'amount': Float})


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal(bind=engine)
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"response": "work"}

# def row2dict(row):
#     d = {}
#     for column in row.__table__.columns:
#         d[column.name] = getattr(row, column.name)
#     return d

@app.get('/transaction')
def get_transactions( db: Session = Depends(get_db)) -> Page[Transaction]:
    return paginate(db, select(Transactions))

@app.get('/transactions', response_model=List[Transaction]) 
def get_transaction(db: Session = Depends(get_db)): 
    # print()
    return db.query(Transactions).all()

add_pagination(app)
