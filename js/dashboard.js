// --- add at the top of dashboard.js ---
let isProcessing = false;          // debounce flag
const alreadyScanned = new Set();  // to ignore repeats in this session
let sessionName = '';

document.getElementById('startSessionBtn').addEventListener('click', () => {
  sessionName = document.getElementById('sessionName').value.trim();

  if (!sessionName) {
    alert("Please enter a session name.");
    return;
  }

  // Clear previous session's scanned codes
  alreadyScanned.clear();
  isProcessing = false;

  document.getElementById('currentSession').innerText = sessionName;
  document.getElementById('session-section').style.display = 'none';
  document.getElementById('scanner-section').style.display = 'block';

  startScanner();
});

function startScanner() {
  const html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (decodedText) => {
      await markAttendance(decodedText);
    }
  ).catch(err => {
    console.error("Camera error:", err);
  });
}

async function markAttendance(barcode) {
  // Prevent processing if already processing or already scanned in this session
  if (isProcessing || alreadyScanned.has(barcode)) {
    return;
  }
  
  isProcessing = true;
  
  try {
    // Check if already marked in database
    const { data: existing, error: checkError } = await supabaseClient
      .from('attendance')
      .select()
      .eq('barcode', barcode)
      .eq('session_name', sessionName);

    if (checkError) {
      alert("Error checking attendance: " + checkError.message);
      return;
    }

    if (existing.length > 0) {
      alert(`Already marked for session: ${sessionName}`);
      alreadyScanned.add(barcode); // Add to local cache
      return;
    }

    // Insert attendance record
    const { error } = await supabaseClient
      .from('attendance')
      .insert([
        { barcode, session_name: sessionName, timestamp: new Date().toISOString() }
      ]);

    if (error) {
      alert("Failed to mark attendance: " + error.message);
    } else {
      alert(`Attendance marked successfully for ${barcode}`);
      alreadyScanned.add(barcode); // Add to local cache to prevent re-scanning
    }
  } finally {
    // Reset processing flag after a short delay to prevent rapid re-scans
    setTimeout(() => {
      isProcessing = false;
    }, 2000); // 2 second cooldown
  }
}
