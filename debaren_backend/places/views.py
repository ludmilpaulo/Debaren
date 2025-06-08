from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Booking, Venue
from .serializers import BookingSerializer
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags

User = get_user_model()

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        print("\n[BookingViewSet] Incoming Booking Request!")
        print("Request data:", request.data)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = serializer.save()
            print("Booking saved:", booking)
        except Exception as e:
            print("Exception during booking save:", e)
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        email = booking.customer_email
        username = email
        password = f"{username}@Debaren2025"

        # 1. User creation if not exists
        user, created = User.objects.get_or_create(email=email, defaults={"username": username})
        print(f"User {'created' if created else 'already exists'}: {user}")

        if created:
            user.set_password(password)
            user.save()
            print("User password set and saved.")

            # 2. Send the styled account/booking email
            context = {
                "user": user,
                "password": password,
                "booking": booking,
                "venue": booking.venue,
                "change_pw_url": f"{settings.FRONTEND_URL}/account/reset-password/"
            }
            subject = f"Your Debaren Booking & Account"
            html_message = render_to_string("emails/account_booking_created.html", context)
            plain_message = strip_tags(html_message)
            try:
                send_mail(
                    subject,
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    html_message=html_message
                )
                print("Account creation & booking email sent to:", email)
            except Exception as email_exc:
                print("Exception during sending account/booking email:", email_exc)
        else:
            # Existing user: Just send booking confirmation
            context = {
                "user": user,
                "booking": booking,
                "venue": booking.venue,
                "change_pw_url": f"{settings.FRONTEND_URL}/account/reset-password/"
            }
            subject = f"Your Debaren Booking Confirmation"
            html_message = render_to_string("emails/booking_confirmation.html", context)
            plain_message = strip_tags(html_message)
            try:
                send_mail(
                    subject,
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    html_message=html_message
                )
                print("Booking confirmation email sent to:", email)
            except Exception as email_exc:
                print("Exception during sending booking confirmation email:", email_exc)

        print("All steps done, returning API response.\n")
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    

# views.py

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Venue, VenueGalleryImage
from .serializers import VenueGalleryImageSerializer

class VenueGalleryUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, venue_id):
        venue = Venue.objects.get(pk=venue_id)
        images = request.FILES.getlist("gallery")
        gallery_images = []
        for img in images:
            gallery_image = VenueGalleryImage.objects.create(venue=venue, image=img)
            gallery_images.append(gallery_image)
        serializer = VenueGalleryImageSerializer(gallery_images, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

