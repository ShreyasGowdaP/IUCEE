function generateBarcode() {
    return 'BAR' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  
  document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const college = document.getElementById('college').value;
    const aadhar = document.getElementById('aadhar').value;
    const barcode = generateBarcode();
    
    // Basic validation
    if (phone.length !== 10 || !/^[0-9]+$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    
    if (aadhar.length !== 12 || !/^[0-9]+$/.test(aadhar)) {
      alert('Please enter a valid 12-digit Aadhar number');
      return;
    }
  
    // Call Razorpay
    const options = {
      key: "rzp_test_3M1E7zlhT1CQnZ", // Replace with your Razorpay Key ID
      amount: 100, // in paise => ₹100
      currency: "INR",
      name: "Event Registration",
      description: "Pay & Register",
      handler: async function (response) {
        // Payment success
        const { error } = await supabaseClient
          .from('registrations')
          .insert([{ 
            email, 
            name, 
            phone_number: phone, 
            college_name: college, 
            aadhar_number: aadhar, 
            payment_status: "Paid", 
            barcode 
          }]);
  
        if (error) {
          alert("Registration failed: " + error.message);
        } else {
          alert(`✅ Registered Successfully. Your Barcode: ${barcode}`);
        }
      },
      prefill: {
        name: name,
        email: email,
        contact: phone
      },
      theme: {
        color: "#3399cc"
      }
    };
  
    const rzp = new Razorpay(options);
    rzp.open();
  });
 