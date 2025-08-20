export default function PreviewBox() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1536px",
        height: "864px",
        aspectRatio: "16 / 9",
        borderRadius: "37px",
        border: "1px solid #1F5A05",
        background: "#111", 
        boxShadow: "0 2px 50px 0 rgba(24, 68, 5, 0.60)",
        overflow: "hidden", 
      }}
    >
      <img
        src="public/Web 2.png" 
        alt="미리보기"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
