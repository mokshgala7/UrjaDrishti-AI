import logging
from flask import jsonify
from werkzeug.exceptions import HTTPException

logger = logging.getLogger(__name__)

class AppError(Exception):
    def __init__(self, message, error_code="APPLICATION_ERROR", status_code=400, details=None):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}

def register_error_handlers(app):
    @app.errorhandler(AppError)
    def handle_app_error(err):
        return jsonify({
            "status": "error",
            "error_code": err.error_code,
            "message": err.message,
            "details": err.details
        }), err.status_code

    @app.errorhandler(HTTPException)
    def handle_http_exception(err):
        return jsonify({
            "status": "error",
            "error_code": f"HTTP_{err.code}",
            "message": err.description
        }), err.code

    @app.errorhandler(Exception)
    def handle_generic_exception(err):
        logger.exception("Unhandled server exception: %s", str(err))
        return jsonify({
            "status": "error",
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An internal server error occurred."
        }), 500
