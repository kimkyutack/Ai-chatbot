import jsPDF from "jspdf";
import { UploadedFile } from "../hooks/useFileUpload";
import { loadFontAsBase64 } from "./fontUtils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  files?: UploadedFile[];
}

export const exportToPDF = async (
  messages: Message[],
  filename: string = "chat-export.pdf"
) => {
  try {
    const fontUrlRegular = process.env.PUBLIC_URL
      ? process.env.PUBLIC_URL + "/fonts/NotoSansKR-Regular.ttf"
      : "/fonts/NotoSansKR-Regular.ttf";
    const fontUrlBold = process.env.PUBLIC_URL
      ? process.env.PUBLIC_URL + "/fonts/NotoSansKR-Bold.ttf"
      : "/fonts/NotoSansKR-Bold.ttf";
    const fontBase64Regular = await loadFontAsBase64(fontUrlRegular);
    const fontBase64Bold = await loadFontAsBase64(fontUrlBold);

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addFileToVFS("NotoSansKR-Regular.ttf", fontBase64Regular);
    pdf.addFont("NotoSansKR-Regular.ttf", "NotoSansKR", "normal");
    pdf.addFileToVFS("NotoSansKR-Bold.ttf", fontBase64Bold);
    pdf.addFont("NotoSansKR-Bold.ttf", "NotoSansKR", "bold");
    pdf.setFont("NotoSansKR", "normal");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    let yPosition = margin;
    const lineHeight = 6;
    const messageSpacing = 8;

    pdf.setFontSize(18);
    pdf.setFont("NotoSansKR", "bold");
    pdf.text("AI 챗봇 대화 기록", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont("NotoSansKR", "normal");
    const currentDate = new Date().toLocaleDateString("ko-KR");
    pdf.text(`내보내기 날짜: ${currentDate}`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 20;

    pdf.setFontSize(10);
    pdf.setFont("NotoSansKR", "normal");

    for (const message of messages) {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFont("NotoSansKR", "bold");
      const sender = message.sender === "user" ? "사용자" : "AI 챗봇";
      const senderColor =
        message.sender === "user" ? [102, 126, 234] : [118, 75, 162];
      pdf.setTextColor(senderColor[0], senderColor[1], senderColor[2]);
      pdf.text(sender, margin, yPosition);
      yPosition += lineHeight;

      pdf.setFont("NotoSansKR", "normal");
      pdf.setTextColor(0, 0, 0);

      const text = message.text;
      const lines = pdf.splitTextToSize(text, contentWidth);

      for (const line of lines) {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      }

      if (message.files && message.files.length > 0) {
        yPosition += 5;
        pdf.setFont("NotoSansKR", "normal");
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `첨부 파일: ${message.files.map((f) => f.name).join(", ")}`,
          margin,
          yPosition
        );
        yPosition += lineHeight;
      }

      pdf.setFont("NotoSansKR", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      const time = message.timestamp.toLocaleString("ko-KR");
      pdf.text(time, margin, yPosition);
      yPosition += lineHeight + messageSpacing;

      pdf.setFontSize(10);
      pdf.setFont("NotoSansKR", "normal");
    }

    pdf.save(filename);

    return true;
  } catch (error) {
    console.error("PDF 내보내기 오류:", error);
    throw new Error("PDF 내보내기에 실패했습니다.");
  }
};

export const exportToText = (
  messages: Message[],
  filename: string = "chat-export.txt"
) => {
  try {
    let content = "AI 챗봇 대화 기록\n";
    content += "=".repeat(50) + "\n\n";
    content += `내보내기 날짜: ${new Date().toLocaleDateString("ko-KR")}\n\n`;

    for (const message of messages) {
      const sender = message.sender === "user" ? "사용자" : "AI 챗봇";
      const time = message.timestamp.toLocaleString("ko-KR");

      content += `[${sender}] (${time})\n`;
      content += `${message.text}\n`;

      if (message.files && message.files.length > 0) {
        content += `첨부 파일: ${message.files
          .map((f) => f.name)
          .join(", ")}\n`;
      }

      content += "\n";
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("텍스트 내보내기 오류:", error);
    throw new Error("텍스트 내보내기에 실패했습니다.");
  }
};
