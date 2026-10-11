from flask import jsonify

def success_response(data=None, message="Success", metadata=None, status_code=200):
    response = {
        "status": "success",
        "message": message,
        "data": data if data is not None else {}
    }
    if metadata:
        response["metadata"] = metadata
    return jsonify(response), status_code

def error_response(message="An error occurred", error_code="INTERNAL_ERROR", details=None, status_code=400):
    response = {
        "status": "error",
        "error_code": error_code,
        "message": message
    }
    if details:
        response["details"] = details
    return jsonify(response), status_code

def paginated_response(items, total_count, page, page_size, metadata=None):
    total_pages = (total_count + page_size - 1) // page_size if page_size > 0 else 1
    response = {
        "status": "success",
        "data": {
            "items": items,
            "pagination": {
                "total_items": total_count,
                "page": page,
                "page_size": page_size,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_prev": page > 1
            }
        }
    }
    if metadata:
        response["metadata"] = metadata
    return jsonify(response), 200
