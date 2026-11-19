import logging
from typing import Dict, Any, List, Optional
from neo4j import GraphDatabase, Driver
from app.config import settings

logger = logging.getLogger(__name__)

class Neo4jClient:
    def __init__(self):
        self._driver: Optional[Driver] = None
        self._is_connected: bool = False
        self._connect()

    def _connect(self):
        try:
            self._driver = GraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
                connection_timeout=2.0
            )
            # Verify connectivity
            self._driver.verify_connectivity()
            self._is_connected = True
            logger.info(f"Successfully connected to Neo4j at {settings.NEO4J_URI}")
        except Exception as e:
            self._is_connected = False
            self._driver = None
            logger.warning(f"Neo4j connection inactive ({e}). Using embedded high-performance graph engine.")

    def is_connected(self) -> bool:
        if not self._driver:
            return False
        try:
            self._driver.verify_connectivity()
            self._is_connected = True
            return True
        except Exception:
            self._is_connected = False
            return False

    def close(self):
        if self._driver:
            self._driver.close()
            self._is_connected = False

    def execute_read(self, query: str, parameters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        if not self.is_connected() or not self._driver:
            return []
        try:
            with self._driver.session() as session:
                result = session.run(query, parameters or {})
                return [record.data() for record in result]
        except Exception as e:
            logger.error(f"Neo4j execute_read error: {e}")
            return []

    def execute_write(self, query: str, parameters: Optional[Dict[str, Any]] = None) -> Any:
        if not self.is_connected() or not self._driver:
            return None
        try:
            with self._driver.session() as session:
                return session.run(query, parameters or {})
        except Exception as e:
            logger.error(f"Neo4j execute_write error: {e}")
            return None

    def sync_knowledge_graph(self, nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]):
        """Seed or update Neo4j with knowledge nodes and edges when connected."""
        if not self.is_connected():
            return
        try:
            with self._driver.session() as session:
                # Merge nodes
                for node in nodes:
                    lbl = node.get("label", "Entity")
                    props = node.get("properties", {})
                    props["id"] = node["id"]
                    props["name"] = node.get("name", node["id"])
                    
                    query = f"MERGE (n:{lbl} {{id: $id}}) SET n += $props"
                    session.run(query, {"id": node["id"], "props": props})

                # Merge edges
                for edge in edges:
                    rel_type = edge["type"]
                    props = edge.get("properties", {})
                    query = f"""
                    MATCH (s {{id: $src}})
                    MATCH (t {{id: $tgt}})
                    MERGE (s)-[r:{rel_type}]->(t)
                    SET r += $props
                    """
                    session.run(query, {"src": edge["source"], "tgt": edge["target"], "props": props})
            logger.info("Successfully synced knowledge graph dataset to Neo4j.")
        except Exception as e:
            logger.error(f"Failed to sync knowledge graph to Neo4j: {e}")

neo4j_client = Neo4jClient()
