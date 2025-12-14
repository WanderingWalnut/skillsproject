from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = ""

engine = create_engine(DATABASE_URL, connect_args=
                       {"check_same_thread": False} # Need for SQLite and FastAPI threading
                       )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

