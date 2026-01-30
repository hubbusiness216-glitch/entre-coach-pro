import jsPDF from 'jspdf';

interface CommunicationScores {
  fluency: number;
  grammar: number;
  pronunciation: number;
  listening: number;
  overall: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  date: string;
}

interface BusinessPlanData {
  interest: string;
  budget: string;
  location: string;
  goals: string;
  date: string;
}

export const generateCommunicationReportPDF = (
  userName: string,
  scores: CommunicationScores
): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ENTREPRENEUR-X', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Communication Skills Assessment Report', 20, 35);
  
  // User Info
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Candidate: ${userName}`, 20, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Assessment Date: ${scores.date}`, 20, 68);
  
  // Overall Score Box
  doc.setFillColor(245, 158, 11);
  doc.roundedRect(pageWidth - 70, 50, 50, 30, 3, 3, 'F');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`${scores.overall}%`, pageWidth - 45, 70, { align: 'center' });
  doc.setFontSize(8);
  doc.text('OVERALL', pageWidth - 45, 76, { align: 'center' });
  
  // Score Breakdown
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Score Breakdown', 20, 95);
  
  const scoreItems = [
    { label: 'Fluency', score: scores.fluency },
    { label: 'Grammar', score: scores.grammar },
    { label: 'Pronunciation', score: scores.pronunciation },
    { label: 'Listening', score: scores.listening },
  ];
  
  let yPos = 105;
  scoreItems.forEach(item => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(item.label, 20, yPos);
    doc.text(`${item.score}%`, 80, yPos);
    
    // Progress bar background
    doc.setFillColor(229, 231, 235);
    doc.roundedRect(100, yPos - 4, 80, 6, 1, 1, 'F');
    
    // Progress bar fill
    const color = item.score >= 80 ? [34, 197, 94] : item.score >= 60 ? [245, 158, 11] : [249, 115, 22];
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(100, yPos - 4, (item.score / 100) * 80, 6, 1, 1, 'F');
    
    yPos += 15;
  });
  
  // Feedback Section
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Feedback', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const feedbackLines = doc.splitTextToSize(scores.feedback, pageWidth - 40);
  doc.text(feedbackLines, 20, yPos);
  yPos += feedbackLines.length * 5 + 10;
  
  // Strengths
  if (scores.strengths.length > 0) {
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(15, yPos - 5, (pageWidth - 30) / 2 - 5, 45, 3, 3, 'F');
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Strengths', 20, yPos + 5);
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    scores.strengths.forEach((s, i) => {
      doc.text(`• ${s}`, 20, yPos + 15 + i * 8);
    });
  }
  
  // Improvements
  if (scores.improvements.length > 0) {
    const xOffset = (pageWidth - 30) / 2 + 20;
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(xOffset - 5, yPos - 5, (pageWidth - 30) / 2 - 5, 45, 3, 3, 'F');
    doc.setTextColor(217, 119, 6);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Areas to Improve', xOffset, yPos + 5);
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    scores.improvements.forEach((s, i) => {
      doc.text(`• ${s}`, xOffset, yPos + 15 + i * 8);
    });
  }
  
  // Footer
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 280, pageWidth, 17, 'F');
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(8);
  doc.text('ENTREPRENEUR-X | Academic Prototype | NLP Simulation for Educational Purposes', pageWidth / 2, 289, { align: 'center' });
  
  return doc;
};

export const generateBusinessPlanReportPDF = (
  userName: string,
  plans: BusinessPlanData[]
): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ENTREPRENEUR-X', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Business Planning Summary Report', 20, 35);
  
  // User Info
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Entrepreneur: ${userName}`, 20, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 68);
  doc.text(`Total Plans: ${plans.length}`, 20, 76);
  
  let yPos = 95;
  
  plans.slice(0, 5).forEach((plan, index) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 30;
    }
    
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(15, yPos - 8, pageWidth - 30, 45, 3, 3, 'F');
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Plan ${index + 1}: ${plan.interest}`, 20, yPos);
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Budget: ${plan.budget} | Location: ${plan.location}`, 20, yPos + 10);
    doc.text(`Created: ${plan.date}`, 20, yPos + 18);
    
    const goalLines = doc.splitTextToSize(`Goals: ${plan.goals}`, pageWidth - 50);
    doc.text(goalLines.slice(0, 2), 20, yPos + 26);
    
    yPos += 55;
  });
  
  // Footer
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 280, pageWidth, 17, 'F');
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(8);
  doc.text('ENTREPRENEUR-X | Academic Prototype | Business Planning for Educational Purposes', pageWidth / 2, 289, { align: 'center' });
  
  return doc;
};
