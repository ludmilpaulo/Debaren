from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

from .serializers import ContactMessageSerializer
from .models import ContactMessage

from django.utils import timezone

class ContactFormView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            # Save the message to the DB
            serializer.save()

            name = serializer.validated_data['name']
            email = serializer.validated_data['email']
            message = serializer.validated_data['message']

            # --- Notify your team/admin
            subject_admin = f"[Debaren Contact] New Message from {name}"
            message_admin = f"""
            You have received a new contact form submission from Debaren:

            Name: {name}
            Email: {email}
            Message:
            {message}

            View this message in the admin panel for full details.
                        """
            EmailMultiAlternatives(
                subject_admin,
                message_admin,
                settings.DEFAULT_FROM_EMAIL,
                [settings.CONTACT_EMAIL],
            ).send()

            # --- Professional HTML Auto-reply to user
            html_content = render_to_string(
                "contact_autoreply.html",
                {
                    "name": name,
                    "brand": "Debaren",
                    "support_email": "support@debaren.com",
                    "phone": "+27 12 345 6789",
                    "whatsapp": "+27 12 345 6789",
                    "address": "Sandton City, Johannesburg, South Africa",
                    "map_url": "https://www.google.com/maps?q=Sandton%20City,%20Johannesburg,%20South%20Africa",
                    "now": timezone.now(),
                }
            )
            subject_user = "Thank you for contacting Debaren!"
            msg = EmailMultiAlternatives(
                subject_user,
                # Fallback plain text (optional)
                f"Hi {name},\n\nThank you for contacting Debaren. We'll reply soon.",
                settings.DEFAULT_FROM_EMAIL,
                [email],
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()

            return Response({"success": True, "detail": "Message sent!"}, status=status.HTTP_200_OK)

        # If validation fails
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
