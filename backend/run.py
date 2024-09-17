# import pandas as pd 

from typing import Union

from fastapi import Depends, FastAPI, HTTPException
from fastapi_pagination import Page, add_pagination, paginate

from sqlalchemy import create_engine, Float
from sqlalchemy.orm import sessionmaker, Session
from models import Transactions, Base

from pydantic import BaseModel, FiniteFloat
import pandas as pd 
from datetime import date
import os 
from dotenv import load_dotenv
load_dotenv()



DB_URL = "sqlite:///./finance.db"


engine = create_engine(DB_URL, echo=True)




# Base.metadata.create_all(bind=engine)

data = pd.read_csv('Credit.csv', index_col=0)
data.rename(columns={'Transaction Date': 'transaction_date', 'Description': 'description','Amount': 'amount','Category': 'category','Bank': 'bank'}, inplace=True)
data.to_sql('transactions', con=engine, if_exists='append', index=True, index_label='id', dtype={'amount': Float})

app = FastAPI()


# Dependency
def get_db():
    db = Session(bind=engine)
    try:
        yield db
    finally:
        db.close()

class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

class Transaction(BaseModel): 
    id: int
    transaction_date: date
    description: str 
    amount: Union[float, None] = None
    category: Union[str, None] = None
    bank: str 
    
    class Config: 
        orm_mode = True


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}


# @app.get("/transactions/")
# async def get_users() -> Page[Transaction]:  # use Page[UserOut] as return type annotation
#     def get_user(db: Session, user_id: int):
#     return db.query(models.User).filter(models.User.id == user_id).first()
#     return paginate(users)  # use paginate function to paginate your data

def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = getattr(row, column.name)
    return d

@app.get('/transactions')
async def get_transactions( db: Session = Depends(get_db)) -> Page[Transaction]:
    data = db.query(Transactions).all()
    
    data = [row2dict(d) for d in data]

    print(data)
    return paginate(data)


add_pagination(app)
