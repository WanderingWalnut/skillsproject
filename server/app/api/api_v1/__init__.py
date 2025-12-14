"""
API v1 package.

Expose `api_router` at the package level so `app.main` can import it cleanly.
"""

from .api import api_router

__all__ = ["api_router"]


