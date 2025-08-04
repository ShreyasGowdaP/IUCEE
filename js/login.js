document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const { data, error } = await supabaseClient
      .from('organizers')
      .select()
      .eq('email', email)
      .eq('password', password);
  
    if (error || data.length === 0) {
      alert("Invalid login");
    } else {
      window.location.href = "organizer-dashboard.html";
    }
  });
  