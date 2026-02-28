"""
Aura Drive — Analytics Router
Quarterly aggregates and insights endpoints — replaces the legacy Pandas analytics.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db
from app.models import Sale
from app.schemas import QuarterlyAggregate, InsightsResponse
from app.auth import verify_credentials

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


def _get_quarterly_data(db: Session) -> list[QuarterlyAggregate]:
    """Compute quarterly aggregates from raw sales data using raw SQL for SQLite compatibility."""
    query = text("""
        SELECT
            strftime('%Y', sale_date) AS year,
            CAST((CAST(strftime('%m', sale_date) AS INTEGER) + 2) / 3 AS INTEGER) AS quarter_num,
            COUNT(id) AS total_units_sold,
            SUM(sale_price) AS total_revenue,
            AVG(sale_price) AS average_price
        FROM sales
        GROUP BY year, quarter_num
        ORDER BY year, quarter_num
    """)

    results = db.execute(query).fetchall()

    aggregates = []
    for row in results:
        quarter_label = f"Q{row.quarter_num}-{row.year}"
        aggregates.append(
            QuarterlyAggregate(
                quarter=quarter_label,
                total_units_sold=int(row.total_units_sold),
                total_revenue=round(float(row.total_revenue), 2),
                average_price=round(float(row.average_price), 2),
            )
        )
    return aggregates


@router.get("/quarterly", response_model=list[QuarterlyAggregate])
def get_quarterly_aggregates(
    db: Session = Depends(get_db),
    _user: str = Depends(verify_credentials),
):
    """Returns aggregated sales data by quarter (replaces legacy CSV quarterly view)."""
    return _get_quarterly_data(db)


@router.get("/insights", response_model=InsightsResponse)
def get_insights(
    db: Session = Depends(get_db),
    _user: str = Depends(verify_credentials),
):
    """
    Computed analytics insights:
    - Quarter with maximum revenue
    - Quarter with minimum revenue
    - All quarterly data for YoY comparison
    Replaces legacy: 'Quarter with maximum/minimum sales'
    """
    quarters = _get_quarterly_data(db)

    if not quarters:
        return InsightsResponse(
            max_quarter="N/A",
            max_revenue=0,
            min_quarter="N/A",
            min_revenue=0,
            quarters=[],
        )

    max_q = max(quarters, key=lambda q: q.total_revenue)
    min_q = min(quarters, key=lambda q: q.total_revenue)

    return InsightsResponse(
        max_quarter=max_q.quarter,
        max_revenue=max_q.total_revenue,
        min_quarter=min_q.quarter,
        min_revenue=min_q.total_revenue,
        quarters=quarters,
    )
