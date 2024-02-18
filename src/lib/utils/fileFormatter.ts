function formatFileSize(sizeInBytes: number) {
 if (sizeInBytes >= 1024 * 1024 * 1024) {
  return (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
 } else if (sizeInBytes >= 1024 * 1024) {
  return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
 } else if (sizeInBytes >= 1024) {
  return (sizeInBytes / 1024).toFixed(2) + ' KB';
 } else {
  return sizeInBytes + ' B';
 }
}
export { formatFileSize };
