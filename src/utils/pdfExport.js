export const generatePassPDF = (app) => {
  // Use professional printing route instead of brittle PDF generation
  const printUrl = `${window.location.origin}${window.location.pathname}#/print/${app.id}`;
  window.open(printUrl, '_blank');
}
