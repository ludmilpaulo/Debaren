// components/MapEmbed.tsx

export default function MapEmbed() {
  return (
    <iframe
      src="https://www.google.com/maps?q=Sandton%20City,%20Johannesburg,%20South%20Africa&output=embed"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Debaren Location"
    />
  );
}
