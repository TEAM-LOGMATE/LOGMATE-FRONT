type FeatureCardProps = {
  title: string;
  image: string;
  imageStyle?: React.CSSProperties; 
};

export default function FeatureCard({ title, image, imageStyle }: FeatureCardProps) {
  return (
    <div
      style={{
        display: "flex",
        height: "400px",
        padding: "40px 159px",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: "10px",
        borderRadius: "24px",
        background: "var(--Brand-Primary, #4FE75E)",
        position: "relative",
      }}
    >
      {/* 이미지 */}
      <img
        src={image}
        alt="feature"
        style={{
          position: "absolute",
          top: "50%",
          left: "56%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          height: "auto",
          objectFit: "contain",
          ...imageStyle,
        }}
      />

      {/* 텍스트 */}
      <span
        style={{
          color: "var(--Brand-Background, #091104)",
          textAlign: "center",
          fontFamily: "SUIT",
          fontSize: "24px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "140%",
          letterSpacing: "-0.4px",
        }}
      >
        {title}
      </span>
    </div>
  );
}
