async function markAttendance() {
  const barcode = document.getElementById('barcodeInput').value.trim().toUpperCase();
  const session = document.getElementById('sessionSelect').value;

  if (!barcode) {
    alert("Please scan or enter a barcode.");
    return;
  }

  // Validate barcode
  const { data: regData, error: regError } = await supabaseClient
    .from('registrations')
    .select('*')
    .eq('barcode', barcode);

  if (!regData || regData.length === 0) {
    alert("❌ Barcode not found in registrations.");
    return;
  }

  // Prevent duplicate entry for the same session
  const { data: existingEntry } = await supabaseClient
    .from('attendance')
    .select('*')
    .eq('barcode', barcode)
    .eq('session_name', session);

  if (existingEntry.length > 0) {
    alert("⚠️ Attendance already marked for this session.");
    return;
  }

  // Insert attendance
  const { error: attendanceError } = await supabaseClient
    .from('attendance')
    .insert([
      {
        barcode: barcode,
        session_name: session,
        timestamp: new Date().toISOString()
      }
    ]);

  if (attendanceError) {
    alert("❌ Failed to mark attendance: " + attendanceError.message);
  } else {
    alert("✅ Attendance marked successfully!");
  }
}
