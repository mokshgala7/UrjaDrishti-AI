from flask import Blueprint, request, send_file
from services.dataset_service import (
    get_all_datasets,
    get_dataset_details,
    get_dataset_preview,
    get_dataset_statistics,
    get_dataset_quality,
    refresh_datasets_cache
)
from utils.csv_loader import registry
from utils.response_helpers import success_response, paginated_response

dataset_bp = Blueprint('datasets', __name__)

@dataset_bp.route('/', methods=['GET'])
@dataset_bp.route('/list', methods=['GET'])
def list_datasets_route():
    datasets = get_all_datasets()
    return success_response(datasets, metadata={"total_datasets": len(datasets)})

@dataset_bp.route('/<dataset_id>', methods=['GET'])
def dataset_details_route(dataset_id):
    details = get_dataset_details(dataset_id)
    return success_response(details)

@dataset_bp.route('/<dataset_id>/preview', methods=['GET'])
def dataset_preview_route(dataset_id):
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 20))
    preview = get_dataset_preview(dataset_id, page=page, page_size=page_size)
    return paginated_response(
        items=preview["items"],
        total_count=preview["total_items"],
        page=preview["page"],
        page_size=preview["page_size"],
        metadata={"columns": preview["columns"]}
    )

@dataset_bp.route('/<dataset_id>/statistics', methods=['GET'])
def dataset_statistics_route(dataset_id):
    stats = get_dataset_statistics(dataset_id)
    return success_response(stats)

@dataset_bp.route('/<dataset_id>/quality', methods=['GET'])
def dataset_quality_route(dataset_id):
    quality = get_dataset_quality(dataset_id)
    return success_response(quality)

@dataset_bp.route('/<dataset_id>/download', methods=['GET'])
def dataset_download_route(dataset_id):
    safe_path = registry.get_safe_download_path(dataset_id)
    return send_file(
        str(safe_path),
        as_attachment=True,
        download_name=f"{dataset_id}.csv",
        mimetype="text/csv"
    )

@dataset_bp.route('/refresh', methods=['POST'])
def dataset_refresh_route():
    result = refresh_datasets_cache()
    return success_response(result)
