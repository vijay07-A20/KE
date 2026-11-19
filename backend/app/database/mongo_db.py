import logging
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from app.config import settings

logger = logging.getLogger(__name__)

mongo_client = None
mongo_database = None


def get_mongo_database():
    global mongo_client, mongo_database
    if not settings.MONGODB_URI:
        return None
    if mongo_database is None:
        mongo_client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
        mongo_client.admin.command("ping")
        mongo_database = mongo_client[settings.MONGODB_DATABASE]
        logger.info("Connected to MongoDB Atlas database %s", settings.MONGODB_DATABASE)
    return mongo_database


def close_mongo_database():
    global mongo_client, mongo_database
    if mongo_client is not None:
        mongo_client.close()
    mongo_client = None
    mongo_database = None
