type WelcomeEmailProps = {
  email: string;
};

export function WelcomeEmail({ email }: WelcomeEmailProps) {
  return (
    <div
      style={{
        background: "#0b0c10",
        color: "#f4f4f5",
        fontFamily: "Arial, sans-serif",
        padding: "40px",
      }}
    >
      <div
        style={{
          border: "1px solid #27272a",
          borderRadius: "18px",
          margin: "0 auto",
          maxWidth: "520px",
          padding: "32px",
        }}
      >
        <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 18px" }}>
          AddressBook
        </p>
        <h1 style={{ fontSize: "28px", lineHeight: "1.15", margin: "0 0 18px" }}>
          Your contact space is ready.
        </h1>
        <p style={{ color: "#a1a1aa", lineHeight: "1.7", margin: 0 }}>
          The account for {email} was created successfully. You can now keep
          your essential contacts in one focused, private place.
        </p>
      </div>
    </div>
  );
}
