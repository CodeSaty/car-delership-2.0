"""
Aura Drive — Database Seeder
Populates the database with realistic luxury dealership data.
"""

from datetime import date
from sqlalchemy.orm import Session
from app.models import Vehicle, Client, Sale, VehicleStatus, VIPTier


def seed_database(db: Session):
    """Seed the database with sample luxury auto data if empty."""

    # Skip if data already exists
    if db.query(Vehicle).count() > 0:
        return

    # ── Vehicles ──────────────────────────────────────
    vehicles = [
        Vehicle(vin="WP0AB2A71KS123001", make="Porsche", model="911 Turbo S", year=2025, purchase_price=185000, status=VehicleStatus.SOLD.value),
        Vehicle(vin="WP0AB2A71KS123002", make="Porsche", model="Cayenne Turbo GT", year=2025, purchase_price=195000, status=VehicleStatus.SOLD.value),
        Vehicle(vin="ZFF80ALA5K0230001", make="Ferrari", model="F8 Tributo", year=2024, purchase_price=280000, status=VehicleStatus.SOLD.value),
        Vehicle(vin="ZFF80ALA5K0230002", make="Ferrari", model="Roma Spider", year=2025, purchase_price=265000, status=VehicleStatus.SOLD.value),
        Vehicle(vin="ZHWUF4ZF3LLA00001", make="Lamborghini", model="Huracán EVO", year=2024, purchase_price=260000, status=VehicleStatus.SOLD.value),
        Vehicle(vin="ZHWUF4ZF3LLA00002", make="Lamborghini", model="Urus Performante", year=2025, purchase_price=240000, status=VehicleStatus.SOLD.value),
        Vehicle(vin="SCFLMCDY1KGR00001", make="Aston Martin", model="DB12", year=2025, purchase_price=245000, status=VehicleStatus.SOLD.value),
        Vehicle(vin="SCFLMCDY1KGR00002", make="Aston Martin", model="Vantage V12", year=2024, purchase_price=310000, status=VehicleStatus.SOLD.value),
        Vehicle(vin="SBM14DCA5LW000001", make="McLaren", model="750S", year=2025, purchase_price=320000, status=VehicleStatus.SOLD.value),
        Vehicle(vin="SBM14DCA5LW000002", make="McLaren", model="Artura", year=2025, purchase_price=250000, status=VehicleStatus.SOLD.value),
        Vehicle(vin="SCBBD7ZH3KC00001", make="Bentley", model="Continental GT Speed", year=2025, purchase_price=285000, status=VehicleStatus.SOLD.value),
        Vehicle(vin="SCBBD7ZH3KC00002", make="Bentley", model="Flying Spur", year=2024, purchase_price=230000, status=VehicleStatus.SOLD.value),
        Vehicle(vin="WP0AB2A71KS123003", make="Porsche", model="Taycan Turbo S", year=2026, purchase_price=205000, status=VehicleStatus.AVAILABLE.value),
        Vehicle(vin="ZFF80ALA5K0230003", make="Ferrari", model="296 GTB", year=2026, purchase_price=350000, status=VehicleStatus.AVAILABLE.value),
        Vehicle(vin="ZHWUF4ZF3LLA00003", make="Lamborghini", model="Revuelto", year=2026, purchase_price=600000, status=VehicleStatus.IN_TRANSIT.value),
    ]
    db.add_all(vehicles)
    db.flush()

    # ── Clients ───────────────────────────────────────
    clients = [
        Client(first_name="Alexander", last_name="Rothschild", email="a.rothschild@luxmail.com", phone="+1-212-555-0101", lifetime_value=1250000, vip_tier=VIPTier.BLACK.value),
        Client(first_name="Victoria", last_name="Chen-Wu", email="victoria.cw@elitemail.com", phone="+1-310-555-0202", lifetime_value=890000, vip_tier=VIPTier.PLATINUM.value),
        Client(first_name="Sebastian", last_name="Al-Rashid", email="s.alrashid@premiummail.com", phone="+971-55-555-0303", lifetime_value=2100000, vip_tier=VIPTier.BLACK.value),
        Client(first_name="Isabella", last_name="Montague", email="i.montague@finesse.com", phone="+44-20-555-0404", lifetime_value=560000, vip_tier=VIPTier.GOLD.value),
        Client(first_name="James", last_name="Worthington III", email="j.worthington@heritage.com", phone="+1-617-555-0505", lifetime_value=340000, vip_tier=VIPTier.GOLD.value),
        Client(first_name="Natalia", last_name="Petrova", email="n.petrova@luxelife.com", phone="+7-495-555-0606", lifetime_value=1780000, vip_tier=VIPTier.BLACK.value),
        Client(first_name="Marcus", last_name="Sterling", email="m.sterling@vault.com", phone="+1-415-555-0707", lifetime_value=150000, vip_tier=VIPTier.STANDARD.value),
        Client(first_name="Amara", last_name="Okafor-Davies", email="a.okafor@prestige.com", phone="+234-1-555-0808", lifetime_value=420000, vip_tier=VIPTier.GOLD.value),
    ]
    db.add_all(clients)
    db.flush()

    # ── Sales (spanning 6 quarters: Q1'25 → Q2'26) ───
    sales = [
        # Q1 2025  (Jan-Mar)
        Sale(vehicle_id=1, client_id=1, sale_price=218000, sale_date=date(2025, 1, 15), commission=10900),
        Sale(vehicle_id=3, client_id=3, sale_price=335000, sale_date=date(2025, 2, 20), commission=16750),
        # Q2 2025  (Apr-Jun)
        Sale(vehicle_id=2, client_id=2, sale_price=228000, sale_date=date(2025, 4, 10), commission=11400),
        Sale(vehicle_id=5, client_id=6, sale_price=310000, sale_date=date(2025, 5, 5), commission=15500),
        Sale(vehicle_id=4, client_id=1, sale_price=315000, sale_date=date(2025, 6, 18), commission=15750),
        # Q3 2025  (Jul-Sep)
        Sale(vehicle_id=6, client_id=4, sale_price=285000, sale_date=date(2025, 7, 22), commission=14250),
        Sale(vehicle_id=7, client_id=5, sale_price=290000, sale_date=date(2025, 8, 14), commission=14500),
        # Q4 2025  (Oct-Dec)
        Sale(vehicle_id=8, client_id=3, sale_price=375000, sale_date=date(2025, 10, 3), commission=18750),
        Sale(vehicle_id=9, client_id=6, sale_price=385000, sale_date=date(2025, 11, 28), commission=19250),
        Sale(vehicle_id=10, client_id=2, sale_price=295000, sale_date=date(2025, 12, 15), commission=14750),
        # Q1 2026  (Jan-Mar)
        Sale(vehicle_id=11, client_id=8, sale_price=340000, sale_date=date(2026, 1, 10), commission=17000),
        Sale(vehicle_id=12, client_id=7, sale_price=272000, sale_date=date(2026, 2, 25), commission=13600),
    ]
    db.add_all(sales)
    db.commit()

    print("✨ Database seeded with luxury dealership data!")
