"""
Seed script — run this to populate the DB with realistic Dublin listings.
Usage: python seed.py
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.config import supabase_admin
from app.services.embeddings import generate_embedding

LISTINGS = [
    # --- DUBLIN 1 ---
    {
        "raw_text": "Ensuite room available Dublin 1, city centre, female only, €750/month all bills included, available immediately, near NCI and Connolly Station.",
        "title": "Ensuite Room in Dublin 1 City Centre",
        "price": 750, "bills_included": True, "deposit": 750,
        "location": "Mountjoy Square, Dublin 1", "dublin_area": "Dublin 1",
        "available_from": "2026-03-01", "is_permanent": True, "duration_months": None,
        "room_type": "ensuite", "gender_preference": "female",
        "occupant_type": ["professionals"],
        "amenities": ["wifi", "washing machine", "dryer", "furnished"],
        "transport_links": ["Bus 130", "Bus H1", "Bus H2", "Connolly Station"],
        "nearby_places": ["NCI", "DBS", "City Centre", "Spire", "IFSC"],
        "contact": "+353851234567"
    },
    {
        "raw_text": "Temporary room Dublin 1 for male, 2 months, €650/month excluding bills, move in 1st April, near NCI Luas stop.",
        "title": "Temporary Room in Dublin 1 near NCI",
        "price": 650, "bills_included": False, "deposit": 650,
        "location": "Custom House Square, Dublin 1", "dublin_area": "Dublin 1",
        "available_from": "2026-04-01", "is_permanent": False, "duration_months": 2,
        "room_type": "shared", "gender_preference": "male",
        "occupant_type": ["students", "professionals"],
        "amenities": ["wifi", "furnished"],
        "transport_links": ["NCI Luas", "Bus G1", "Bus G2", "Connolly Station"],
        "nearby_places": ["NCI", "Connolly Station", "IFSC"],
        "contact": "+353872345678"
    },

    # --- DUBLIN 2 ---
    {
        "raw_text": "Studio apartment available Dublin 2, Grand Canal Dock, €1400/month bills included, suitable for professional couple, available May 2026.",
        "title": "Studio Apartment in Grand Canal Dock",
        "price": 1400, "bills_included": True, "deposit": 1400,
        "location": "Grand Canal Dock, Dublin 2", "dublin_area": "Dublin 2",
        "available_from": "2026-05-01", "is_permanent": True, "duration_months": None,
        "room_type": "studio", "gender_preference": "couple",
        "occupant_type": ["professionals"],
        "amenities": ["wifi", "washing machine", "dishwasher", "furnished", "balcony", "parking"],
        "transport_links": ["Grand Canal Dock Dart", "Bus 1", "Bus 47"],
        "nearby_places": ["Google HQ", "Boland's Mills", "City Centre"],
        "contact": "+353833456789"
    },

    # --- DUBLIN 4 ---
    {
        "raw_text": "Double room in Ballsbridge Dublin 4, near UCD and RDS, €900/month + bills, female professional preferred, available immediately.",
        "title": "Double Room in Ballsbridge near UCD",
        "price": 900, "bills_included": False, "deposit": 900,
        "location": "Ballsbridge, Dublin 4", "dublin_area": "Dublin 4",
        "available_from": "2026-03-15", "is_permanent": True, "duration_months": None,
        "room_type": "double", "gender_preference": "female",
        "occupant_type": ["professionals"],
        "amenities": ["wifi", "washing machine", "garden", "furnished"],
        "transport_links": ["Bus 4", "Bus 7", "Sandymount Dart"],
        "nearby_places": ["UCD", "RDS", "Aviva Stadium", "Merrion Square"],
        "contact": "+353864567890"
    },

    # --- DUBLIN 6 ---
    {
        "raw_text": "Single room Rathmines Dublin 6, €700/month bills included, any gender, near Luas and city centre, available 1st April.",
        "title": "Single Room in Rathmines",
        "price": 700, "bills_included": True, "deposit": 700,
        "location": "Rathmines, Dublin 6", "dublin_area": "Rathmines",
        "available_from": "2026-04-01", "is_permanent": True, "duration_months": None,
        "room_type": "single", "gender_preference": "any",
        "occupant_type": ["students", "professionals"],
        "amenities": ["wifi", "washing machine", "furnished"],
        "transport_links": ["Bus 14", "Bus 15", "Ranelagh Luas"],
        "nearby_places": ["Rathmines Library", "Swan Centre", "City Centre"],
        "contact": "+353875678901"
    },
    {
        "raw_text": "Large double room Ranelagh Dublin 6, €850/month + bills, male professional, available immediately, 5 min walk to Luas.",
        "title": "Large Double Room in Ranelagh",
        "price": 850, "bills_included": False, "deposit": 850,
        "location": "Ranelagh, Dublin 6", "dublin_area": "Ranelagh",
        "available_from": "2026-03-20", "is_permanent": True, "duration_months": None,
        "room_type": "double", "gender_preference": "male",
        "occupant_type": ["professionals"],
        "amenities": ["wifi", "washing machine", "dryer", "furnished", "garden"],
        "transport_links": ["Ranelagh Luas", "Bus 11", "Bus 44"],
        "nearby_places": ["Ranelagh Village", "UCD", "City Centre"],
        "contact": "+353886789012"
    },

    # --- DUBLIN 7 ---
    {
        "raw_text": "Room available Stoneybatter Dublin 7, €750/month bills included, any gender, great transport links, near Smithfield Luas.",
        "title": "Room in Stoneybatter Dublin 7",
        "price": 750, "bills_included": True, "deposit": 750,
        "location": "Stoneybatter, Dublin 7", "dublin_area": "Dublin 7",
        "available_from": "2026-04-01", "is_permanent": True, "duration_months": None,
        "room_type": "double", "gender_preference": "any",
        "occupant_type": ["students", "professionals"],
        "amenities": ["wifi", "washing machine", "furnished"],
        "transport_links": ["Smithfield Luas", "Bus 25", "Bus 66"],
        "nearby_places": ["Smithfield", "Phoenix Park", "TU Dublin"],
        "contact": "+353897890123"
    },

    # --- DUBLIN 8 ---
    {
        "raw_text": "Double room Dublin 8 Rialto, €750/month + bills, female only, near St James Hospital and Coombe, available immediately.",
        "title": "Double Room in Rialto Dublin 8",
        "price": 750, "bills_included": False, "deposit": 750,
        "location": "Rialto, Dublin 8", "dublin_area": "Dublin 8",
        "available_from": "2026-03-01", "is_permanent": True, "duration_months": None,
        "room_type": "double", "gender_preference": "female",
        "occupant_type": ["students", "professionals"],
        "amenities": ["wifi", "washing machine", "furnished"],
        "transport_links": ["Bus 13", "Bus 40", "Rialto Luas"],
        "nearby_places": ["St James Hospital", "Coombe Hospital", "TU Dublin"],
        "contact": "+353808901234"
    },
    {
        "raw_text": "Temporary accommodation Dublin 8 Portobello, 3 months, €850/month bills included, any gender, near Luas, available April.",
        "title": "Temporary Room in Portobello Dublin 8",
        "price": 850, "bills_included": True, "deposit": 850,
        "location": "Portobello, Dublin 8", "dublin_area": "Dublin 8",
        "available_from": "2026-04-01", "is_permanent": False, "duration_months": 3,
        "room_type": "double", "gender_preference": "any",
        "occupant_type": ["professionals"],
        "amenities": ["wifi", "washing machine", "furnished", "balcony"],
        "transport_links": ["Charlemont Luas", "Bus 14", "Bus 15"],
        "nearby_places": ["St Vincent's Hospital", "Rathmines", "City Centre"],
        "contact": "+353819012345"
    },

    # --- DUBLIN 9 ---
    {
        "raw_text": "Single room Drumcondra Dublin 9, €650/month + bills, student preferred, near DCU and Croke Park, available immediately.",
        "title": "Single Room in Drumcondra near DCU",
        "price": 650, "bills_included": False, "deposit": 650,
        "location": "Drumcondra, Dublin 9", "dublin_area": "Dublin 9",
        "available_from": "2026-03-01", "is_permanent": True, "duration_months": None,
        "room_type": "single", "gender_preference": "any",
        "occupant_type": ["students"],
        "amenities": ["wifi", "washing machine", "furnished"],
        "transport_links": ["Bus 1", "Bus 11", "Drumcondra Train Station"],
        "nearby_places": ["DCU", "Croke Park", "Mater Hospital"],
        "contact": "+353820123456"
    },

    # --- DUBLIN 12 ---
    {
        "raw_text": "Double room Dublin 12 Bluebell, female only, €650/month + bills, near Bluebell Luas stop, available immediately.",
        "title": "Double Room in Bluebell Dublin 12",
        "price": 650, "bills_included": False, "deposit": 500,
        "location": "Bluebell, Dublin 12", "dublin_area": "Dublin 12",
        "available_from": "2026-03-01", "is_permanent": True, "duration_months": None,
        "room_type": "double", "gender_preference": "female",
        "occupant_type": ["students", "professionals"],
        "amenities": ["wifi", "washing machine", "balcony", "furnished"],
        "transport_links": ["Bluebell Luas", "Bus 13", "Bus 68", "Bus 68A"],
        "nearby_places": ["UCD", "NCI", "St James Hospital", "Tallaght Hospital"],
        "contact": "+353831234560"
    },
    {
        "raw_text": "Ensuite room Dublin 12 Crumlin, male preferred, €700/month bills included, near CHI Crumlin hospital, available 1st April.",
        "title": "Ensuite Room in Crumlin Dublin 12",
        "price": 700, "bills_included": True, "deposit": 700,
        "location": "Crumlin, Dublin 12", "dublin_area": "Dublin 12",
        "available_from": "2026-04-01", "is_permanent": True, "duration_months": None,
        "room_type": "ensuite", "gender_preference": "male",
        "occupant_type": ["professionals"],
        "amenities": ["wifi", "washing machine", "furnished", "parking"],
        "transport_links": ["Bus 17", "Bus 18", "Bus 56A"],
        "nearby_places": ["CHI Crumlin", "Tallaght Hospital", "Sundrive Road"],
        "contact": "+353842345671"
    },

    # --- DUBLIN 15 ---
    {
        "raw_text": "Double room Blanchardstown Dublin 15, €650/month + bills, any gender, near Blanchardstown Shopping Centre and IT Blanchardstown.",
        "title": "Double Room in Blanchardstown Dublin 15",
        "price": 650, "bills_included": False, "deposit": 650,
        "location": "Blanchardstown, Dublin 15", "dublin_area": "Dublin 15",
        "available_from": "2026-03-15", "is_permanent": True, "duration_months": None,
        "room_type": "double", "gender_preference": "any",
        "occupant_type": ["students", "professionals"],
        "amenities": ["wifi", "washing machine", "parking", "furnished"],
        "transport_links": ["Bus 38", "Bus 39", "Bus 70"],
        "nearby_places": ["Blanchardstown Shopping Centre", "TU Dublin Blanchardstown", "Connolly Hospital"],
        "contact": "+353853456782"
    },

    # --- CITYWEST ---
    {
        "raw_text": "Double room Citywest, 2 sharing, €550/month + bills, female preferred, 4 min walk to Citywest Luas stop, available 1st March.",
        "title": "Double Room in Citywest near Luas",
        "price": 550, "bills_included": False, "deposit": 550,
        "location": "Citywest, Dublin 24", "dublin_area": "Citywest",
        "available_from": "2026-03-01", "is_permanent": True, "duration_months": None,
        "room_type": "double", "gender_preference": "female",
        "occupant_type": ["students", "professionals"],
        "amenities": ["wifi", "furnished", "washing machine"],
        "transport_links": ["Citywest Luas", "Bus 69"],
        "nearby_places": ["Citywest Shopping Centre", "Tallaght Hospital", "IT Tallaght"],
        "contact": "+353864567893"
    },

    # --- TALLAGHT ---
    {
        "raw_text": "Single room Tallaght, €550/month bills included, any gender, near Tallaght Hospital and IT Tallaght, available immediately.",
        "title": "Single Room in Tallaght",
        "price": 550, "bills_included": True, "deposit": 550,
        "location": "Tallaght, Dublin 24", "dublin_area": "Tallaght",
        "available_from": "2026-03-01", "is_permanent": True, "duration_months": None,
        "room_type": "single", "gender_preference": "any",
        "occupant_type": ["students"],
        "amenities": ["wifi", "washing machine", "furnished"],
        "transport_links": ["Tallaght Luas", "Bus 49", "Bus 54A"],
        "nearby_places": ["Tallaght Hospital", "IT Tallaght", "The Square Shopping Centre"],
        "contact": "+353875678904"
    },

    # --- SANDYFORD ---
    {
        "raw_text": "Ensuite room Sandyford, €950/month bills included, professional female only, near Sandyford Luas and Leopardstown, available April.",
        "title": "Ensuite Room in Sandyford",
        "price": 950, "bills_included": True, "deposit": 950,
        "location": "Sandyford, Dublin 18", "dublin_area": "Sandyford",
        "available_from": "2026-04-01", "is_permanent": True, "duration_months": None,
        "room_type": "ensuite", "gender_preference": "female",
        "occupant_type": ["professionals"],
        "amenities": ["wifi", "washing machine", "dryer", "dishwasher", "furnished", "parking"],
        "transport_links": ["Sandyford Luas", "Bus 44", "Bus 75"],
        "nearby_places": ["Leopardstown", "Central Park", "UCD"],
        "contact": "+353886789015"
    },

    # --- SWORDS ---
    {
        "raw_text": "Double room Swords, €700/month + bills, any gender, near Dublin Airport and Swords town centre, available immediately.",
        "title": "Double Room in Swords near Airport",
        "price": 700, "bills_included": False, "deposit": 700,
        "location": "Swords, Co Dublin", "dublin_area": "Swords",
        "available_from": "2026-03-01", "is_permanent": True, "duration_months": None,
        "room_type": "double", "gender_preference": "any",
        "occupant_type": ["professionals"],
        "amenities": ["wifi", "washing machine", "parking", "garden", "furnished"],
        "transport_links": ["Bus 33", "Bus 41", "Bus 43"],
        "nearby_places": ["Dublin Airport", "Swords Pavilions", "Airside Retail Park"],
        "contact": "+353897890126"
    },

    # --- DUN LAOGHAIRE ---
    {
        "raw_text": "Beautiful double room Dun Laoghaire, sea views, €950/month + bills, professional couple or female, available April.",
        "title": "Double Room in Dún Laoghaire with Sea Views",
        "price": 950, "bills_included": False, "deposit": 950,
        "location": "Dún Laoghaire, Co Dublin", "dublin_area": "Dún Laoghaire",
        "available_from": "2026-04-01", "is_permanent": True, "duration_months": None,
        "room_type": "double", "gender_preference": "couple",
        "occupant_type": ["professionals"],
        "amenities": ["wifi", "washing machine", "dryer", "furnished", "balcony", "sea view"],
        "transport_links": ["Dún Laoghaire Dart", "Bus 46A", "Bus 59"],
        "nearby_places": ["Dún Laoghaire Pier", "UCD", "Blackrock"],
        "contact": "+353808901237"
    },

    # --- CLONDALKIN ---
    {
        "raw_text": "Room available Clondalkin, €580/month bills included, students welcome, near Clondalkin Luas and Liffey Valley.",
        "title": "Room in Clondalkin near Luas",
        "price": 580, "bills_included": True, "deposit": 580,
        "location": "Clondalkin, Dublin 22", "dublin_area": "Clondalkin",
        "available_from": "2026-03-15", "is_permanent": True, "duration_months": None,
        "room_type": "single", "gender_preference": "any",
        "occupant_type": ["students"],
        "amenities": ["wifi", "washing machine", "furnished"],
        "transport_links": ["Clondalkin Luas", "Bus 13", "Bus 51"],
        "nearby_places": ["Liffey Valley Shopping Centre", "IT Tallaght"],
        "contact": "+353819012348"
    },

    # --- TEMPORARY LISTINGS (various areas) ---
    {
        "raw_text": "Short term room available Dublin 2 city centre, 1 month, €900/month bills included, any gender, available immediately.",
        "title": "Short Term Room in Dublin 2 City Centre",
        "price": 900, "bills_included": True, "deposit": 900,
        "location": "Merrion Square, Dublin 2", "dublin_area": "Dublin 2",
        "available_from": "2026-03-01", "is_permanent": False, "duration_months": 1,
        "room_type": "double", "gender_preference": "any",
        "occupant_type": ["professionals"],
        "amenities": ["wifi", "washing machine", "furnished"],
        "transport_links": ["Bus 4", "Bus 7", "Pearse Dart"],
        "nearby_places": ["Merrion Square", "National Gallery", "Trinity College"],
        "contact": "+353820123459"
    },
    {
        "raw_text": "Temporary room Rathmines 6 months, €750/month + bills, female student, near Luas and UCD, available June.",
        "title": "Temporary Room in Rathmines for 6 Months",
        "price": 750, "bills_included": False, "deposit": 750,
        "location": "Rathmines, Dublin 6", "dublin_area": "Rathmines",
        "available_from": "2026-06-01", "is_permanent": False, "duration_months": 6,
        "room_type": "single", "gender_preference": "female",
        "occupant_type": ["students"],
        "amenities": ["wifi", "washing machine", "furnished"],
        "transport_links": ["Ranelagh Luas", "Bus 14", "Bus 15"],
        "nearby_places": ["UCD", "Rathmines College", "City Centre"],
        "contact": "+353831234560"
    },

    # --- BUDGET LISTINGS (under €600) ---
    {
        "raw_text": "Shared room Dublin 15 Castleknock, €450/month bills included, male student, near Coolmine Train Station.",
        "title": "Shared Room in Castleknock Dublin 15",
        "price": 450, "bills_included": True, "deposit": 450,
        "location": "Castleknock, Dublin 15", "dublin_area": "Dublin 15",
        "available_from": "2026-03-01", "is_permanent": True, "duration_months": None,
        "room_type": "shared", "gender_preference": "male",
        "occupant_type": ["students"],
        "amenities": ["wifi", "washing machine"],
        "transport_links": ["Coolmine Train Station", "Bus 37", "Bus 38"],
        "nearby_places": ["Blanchardstown Shopping Centre", "TU Dublin"],
        "contact": "+353842345671"
    },
    {
        "raw_text": "Budget room Tallaght €500/month + bills, any gender, students welcome, near Luas and The Square.",
        "title": "Budget Room in Tallaght",
        "price": 500, "bills_included": False, "deposit": 500,
        "location": "Tallaght, Dublin 24", "dublin_area": "Tallaght",
        "available_from": "2026-03-01", "is_permanent": True, "duration_months": None,
        "room_type": "single", "gender_preference": "any",
        "occupant_type": ["students"],
        "amenities": ["wifi", "washing machine"],
        "transport_links": ["Tallaght Luas", "Bus 49"],
        "nearby_places": ["The Square Shopping Centre", "Tallaght Hospital", "IT Tallaght"],
        "contact": "+353853456782"
    },

    # --- LUXURY / HIGH END ---
    {
        "raw_text": "Premium ensuite Dublin 4 Donnybrook, €1200/month all bills included, professional only, gym access, available immediately.",
        "title": "Premium Ensuite in Donnybrook Dublin 4",
        "price": 1200, "bills_included": True, "deposit": 1200,
        "location": "Donnybrook, Dublin 4", "dublin_area": "Dublin 4",
        "available_from": "2026-03-01", "is_permanent": True, "duration_months": None,
        "room_type": "ensuite", "gender_preference": "any",
        "occupant_type": ["professionals"],
        "amenities": ["wifi", "washing machine", "dryer", "dishwasher", "gym", "furnished", "parking", "balcony"],
        "transport_links": ["Bus 46A", "Bus 145", "Donnybrook"],
        "nearby_places": ["UCD", "RDS", "Aviva Stadium", "Donnybrook Village"],
        "contact": "+353864567893"
    }
]


def seed():
    print(f"Seeding {len(LISTINGS)} listings...\n")
    success = 0
    failed = 0

    for i, listing in enumerate(LISTINGS):
        try:
            # Generate embedding
            embedding = generate_embedding(listing)
            listing["embedding"] = embedding

            # Insert into Supabase
            result = supabase_admin.table("listings").insert(listing).execute()

            if result.data:
                print(f"✓ [{i+1}/{len(LISTINGS)}] {listing['title']}")
                success += 1
            else:
                print(f"✗ [{i+1}/{len(LISTINGS)}] Failed: {listing['title']}")
                failed += 1

        except Exception as e:
            print(f"✗ [{i+1}/{len(LISTINGS)}] Error on {listing['title']}: {e}")
            failed += 1

    print(f"\n--- Done ---")
    print(f"✓ {success} listings seeded successfully")
    if failed:
        print(f"✗ {failed} listings failed")


if __name__ == "__main__":
    seed()