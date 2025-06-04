# Rental Service Django API

This repository contains a simple rental management API built with Django and Django REST framework.

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the project root with at least the following variables:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=True
   DB_NAME=rental_db
   DB_USER=rental_user
   DB_PASSWORD=rental_pass
   DB_HOST=localhost
   DB_PORT=3306
   ```
4. Apply migrations and create a superuser if desired:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

## Running

Start the development server with:

```bash
python manage.py runserver
```

Alternatively, Docker users can run:

```bash
docker-compose up
```

## Key API Endpoints

- `POST /api/auth/register/` – create a new user.
- `POST /api/auth/login/` – obtain JWT tokens.
- `GET /api/listings/` – list or search listings.
- `POST /api/listings/` – create a listing (requires landlord account).
- `GET /api/bookings/` – list bookings for the current user.
- `POST /api/bookings/` – create a booking.
- `PATCH /api/bookings/<id>/status/` – update a booking status.
- `GET /api/analytics/popular-search/` – most popular search terms.
- `GET /api/analytics/popular-listing/` – most viewed listings.
- `GET /api/reviews/?listing=<id>` – list reviews for a listing (auth required).
- `POST /api/reviews/` – create a review (authenticated tenant only).
- `POST /api/upload-image/` – upload an image for a listing (owner auth required).

## Example Requests

```bash
# Fetch reviews for listing 1
curl -H "Authorization: Bearer <token>" \
     http://localhost:8000/api/reviews/?listing=1

# Leave a review for listing 1
curl -X POST http://localhost:8000/api/reviews/ \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"listing": 1, "rating": 5, "comment": "Great stay!"}'

# Upload an image to listing 1
curl -X POST http://localhost:8000/api/upload-image/ \
     -H "Authorization: Bearer <token>" \
     -F "listing=1" \
     -F "image=@/path/to/file.jpg"
```