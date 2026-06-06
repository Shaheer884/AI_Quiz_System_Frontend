import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import it as a standalone function

export const downloadResultPDF = (result) => {
  try {
    if (!result) return alert("No result data found.");

    const doc = new jsPDF();

    // --- Header & Branding ---
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); 
    doc.text("QuizPortal Report", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report ID: ${result._id}`, 14, 28);
    doc.line(14, 32, 196, 32); 

    // --- Student Info ---
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(`Student Name: ${result.user?.name || 'Student'}`, 14, 45);
    doc.text(`Quiz Title: ${result.quiz?.title || 'General Quiz'}`, 14, 52);
    doc.text(`Date: ${new Date(result.completedAt).toLocaleDateString()}`, 14, 59);

    // --- Score Highlight ---
    doc.setFillColor(243, 244, 246);
    doc.rect(14, 70, 182, 20, 'F');
    doc.setFontSize(16);
    doc.setTextColor(22, 163, 74); 
    doc.text(`Final Score: ${result.score} / ${result.totalQuestions}`, 105, 83, { align: "center" });

    // --- FIX: Use autoTable(doc, options) instead of doc.autoTable ---
    const tableColumn = ["Question No.", "Result"];
    const tableRows = result.answers?.map((ans, index) => [
      `Question ${index + 1}`,
      ans.isCorrect ? "CORRECT" : "INCORRECT"
    ]) || [];

    autoTable(doc, {
      startY: 100,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
    });

    // --- Save File ---
    const fileName = `Result_${result.quiz?.title || 'Quiz'}.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Could not generate PDF. Please try again.");
  }
};