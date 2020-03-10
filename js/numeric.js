//--------------------------------- Number Format Text
function formatNumeric(format, idx){
	var result = idx.toString();
	for (var i =0;i < format.length;i++)
	{
		if (result.length < format.length)
			result = "0" + result;      
	}
	return result;
};
function format_number(value, decLength, decSp, thousSep){
	// 20000.45678 => 
	if (typeof(value) == "string") return value;
	var nilai = value.toString();
	var dec = "";
	if (nilai == "NaN") return 0;	
	if (nilai.search(".") == -1) {
		nilai = floatToNilai(parseFloat(nilai),decSp, thousSep);
		for (var i=0;i < decLength;i++)
			dec += "0";
	}else {
		nilai = nilai.replace(".",decSp);
		nilai = nilai.split(decSp);		
		dec = nilai[1];
		if (dec == undefined) dec = "";
		for (var i=0;i < decLength;i++)
			dec += "0";
		nilai = floatToNilai(parseFloat(nilai[0]),decSp, thousSep);
		dec = dec.substr(0,decLength);
	}	
	return nilai + decSp + dec;
};
function parseNilai(value){
	//2.000.000,34 -> 2000000.34 => untuk save ke table  atau olahan	
	var nilai = String(RemoveTitik(value));
	nilai = nilai.replace(",",".");
	
	return nilai;
};
function isNilai(value){
	if (typeof(value) == "string"){
		var c = 0;
		for (var i =0;i < value.length ;i++)
			if (value.charAt(i) == ".") c++;
		if (c >= 1) return true;
		else {
			var tmp = value.split(".");			
			if ( tmp[tmp.length - 1].length == 3 && tmp[0] != "0") 
				return true;
			else return false; 
		}
	} else return false;

};
function RemoveTitik(str){
		
	if (typeof (str) == "string")
  		return str.replace(/\./g,"");
  	else return String(str);
  var num = str;
  var numtmp ="";
  var i;
  
  for (i=0;i<num.length;i++)
   {     
    if (num.charAt(i) != ".")
         numtmp += num.charAt(i); 
   }  
  num = numtmp; 
  return  num;
};
function decToFloat(value)	{
	//2000,56 -> 2000.56 -> untuk olah data aritmatika
	if (typeof(value) != "string") value = value.toString();
	if (value == "NaN") value = "0";
	var nilai = value;
	nilai = nilai.replace(",",".");
	return parseFloat(nilai);
};
function floatToDec(value){
	if (typeof(value) == "string") value = parseFloat(value);
	else if (isNaN(value)) value = 0;
	//2000.56 -> 2000,56 -> untuk komponen
	var nilai = value.toString();
	nilai = nilai.replace(".",",");
	return nilai;
};
function floatToNilai(value,decSep, thousandSep){
	//2000.56 -> 2.000,56 -> untuk komponen
	var nilai = floatToDec(value);
	nilai = decToNilai(nilai,decSep, thousandSep);
	return nilai;
};
function nilaiToFloat(value){
	//2.000,25 -> 2000.25
	var nilai = nilaiToDec(value);
	nilai = decToFloat(nilai);
	return parseFloat(nilai);
};
function nilaiToDec(value){
	//2.000.000,35 -> 2000000,35 
	var nilai = String(RemoveTitik(value));
	return nilai;
};
function decToNilai(value, decSep, thousandSep){
	//2000000,35 -> 2.000.000,35 
	var nilai = strToNilai(value,decSep, thousandSep);
	return nilai;
};
function strToNilai(value, decSep, thousandSep) {
  try	{
	  //if (value.indexOf(".") != -1)
	    //value = value.replace(".",",");      
	  if (typeof(value) != "string") return floatToNilai(value, decSep, thousandSep);
	  var isMin = value.search("-") != -1 ? true : false;
	  if (isMin)  
		value = value.replace("-","");
	  var decpoint = ',';
	  var sep = '.';
	  if (decSep != undefined) decpoint = decSep;
	  if (thousandSep != undefined) sep = thousandSep;
	  var isExit = 0;
	  var num = value;
	  
	  var numtmp ="";
	  var i;
	  
	  for (i=0;i<num.length;i++)
	   {     
	    if (num.charAt(i) != ".")
	         numtmp += num.charAt(i); 
	   }  
	  num = numtmp; 
	  // need a string for operations
	  num = num.toString();
	  // separate the whole number and the fraction if possible
	  a = num.split(decpoint);
	  x = a[0]; // decimal
	  y = a[1]; // fraction
	  z = "";


	  if (typeof(x) != "undefined") {
	    // reverse the digits. regexp works from left to right.
	    for (i=x.length-1;i>=0;i--)
	      z += x.charAt(i);
	    // add seperators. but undo the trailing one, if there
	    z = z.replace(/(\d{3})/g, "$1" + sep);
	    if (z.slice(-sep.length) == sep)
	      z = z.slice(0, -sep.length);
	    x = "";
	    // reverse again to get back the number
	    for (i=z.length-1;i>=0;i--)
	      x += z.charAt(i);
	    // add the fraction back in, if it was there
	    if (typeof(y) != "undefined" && y.length > 0)
	      x += decpoint + y;
	  }  
	  if (isMin)
		 x = '-' + x;
	  return x;
	  //var nCursorPos = numtmp.length;
	  //setCursor(edit,nCursorPos);
	}catch(e){
		alert("strToNilai::"+e);
	}
};
function strToFloat(data) {
    var nilai = String(RemoveTitik(data));
	nilai = nilai.replace(",",".");//alert(nilai +" "+data);
	return parseFloat(nilai);
};
function Compound(R, N){
  var result = Math.pow(1.0 + R, N);
  return result;
};
function Annuity2(R, N, PaymentTime,CompoundRN){
  var result;
  if (R == 0.0 ){
    CompoundRN = 1.0;
    result = N;
  }else{    
    if (Math.abs(R) < 6.1E-5){
      CompoundRN = Math.exp(N * Math.LN10(R));
      result = N*(1+(N-1)*R/2);
    }else{
      CompoundRN = Compound(R, N);
      result = (CompoundRN-1) / R;
    }
    if (PaymentTime == ptStartOfPeriod)
      result = result * (1 + R);
  }  
  return round_decimals(result, 2);
};
function payment2(Rate, NPeriods, FutureValue, PaymentTime){  
	var result = Annuity2(Rate, NPeriods, PaymentTime, 0);
	result = FutureValue / result;
	return result;	
};
function payment(PV, IR, NP) {//endOfPeriode
  var PMT = (PV * IR) / (1 - Math.pow(1 + IR, -NP));
  return round_decimals(PMT, 2);
};
function calculate(pv,rate, nper){//startOfPeriode
  var numerator = pv * Math.pow((1 + rate),nper);
  var denomFracNum = Math.pow((1 + rate), nper + 1) - 1;
  var denominator = denomFracNum/rate - 1;

  var realAnswer = numerator/denominator;
  return realAnswer;
};
function annuity(rate, sisa, lama, plafon) {
	try{
		var ret= "{";
		var angs = Math.round(payment(plafon, rate,lama));
		var totAm = 0;
		var totMargin = 0;
		var pokok = 0;
		var sawal = plafon;
		var margin = 0;
		for (var i = 0;i < sisa; i++){
			pokok = Math.round(calculate(sawal,rate,lama - i));	
		    sawal -= pokok;
		    totAm += pokok;
		    margin = angs - pokok;
		    totMargin += margin;
		}  
		ret = "{pokok: "+pokok+","+
				"margin: "+margin+","+
				"totPayment: "+totAm+","+
				"totMargin: "+totMargin+","+
				"payment:"+angs+" "+
				"}";
		return ret;
	}catch(e){
		systemAPI.alert("annuity:"+e);
	}
};

function round_decimals(original_number, decimals) {
  var result1 = original_number * Math.pow(10, decimals);
  var result2 = Math.round(result1);
  var result3 = result2 / Math.pow(10, decimals);
  return (result3);
};
function terbilang(bilangan) {
	  var angka = ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'];
	  var kata = ['','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan'];
	  var tingkat = ['','Ribu','Juta','Milyar','Triliun'];
      var kalimat = "";  
	  var panjang_bilangan = bilangan.length;
	  /* pengujian panjang bilangan */
	  if (panjang_bilangan > 15) {
	    kalimat = "Diluar Batas";
	    return kalimat;
	  }

	  /* mengambil angka-angka yang ada dalam bilangan,
	     dimasukkan ke dalam array */
	  for (var i = 1; i <= panjang_bilangan; i++) {
	    angka[i] = bilangan.substr(-i,1);
	  } 
	  var i = 1;
	  var j = 0;
	  var subkalimat,kata1,kata2,kata3;
	  kalimat = "";
	  /* mulai proses iterasi terhadap array angka */
	  while (i <= panjang_bilangan) {
	    subkalimat = "";
	    kata1 = "";
	    kata2 = "";
	    kata3 = "";
	    /* untuk ratusan */
	    if (angka[i+2] != "0") {
	      if (angka[i+2] == "1") {
	        kata1 = " Seratus";
	      } else {
	        kata1 = kata[angka[i+2]] + " Ratus";
	      }
	    }

	    /* untuk puluhan atau belasan */
	    if (angka[i+1] != "0") {
	      if (angka[i+1] == "1") {
	        if (angka[i] == "0") {
	          kata2 = "Sepuluh";
	        } else if (angka[i] == "1") {
	          kata2 = "Sebelas";
	        } else {
	          kata2 = kata[angka[i]] + " Belas";
	        }
	      } else {
	        kata2 = kata[angka[i+1]] + " Puluh";
	      }
	    }

	    /* untuk satuan */
	    if (angka[i] != "0") {
	      if (angka[i+1] != "1") {
	        kata3 = kata[angka[i]];
	      }
	    }

	    /* pengujian angka apakah tidak nol semua,
	       lalu ditambahkan tingkat */
	    if ((angka[i] != "0") || (angka[i+1] != "0") || (angka[i+2] != "0")) {
	       subkalimat = kata1 + " "+kata2 + " "+kata3 +"  "+tingkat[j];
	    }
	    /* gabungkan variabe sub kalimat (untuk satu blok 3 angka)
	       ke variabel kalimat */
	    kalimat = subkalimat + kalimat;
	    i = i + 3;
	    j = j + 1;

	  }

	  /* mengganti satu ribu jadi seribu jika diperlukan */
	  if ((angka[5] == "0") && (angka[6] == "0")) {
	       kalimat = kalimat.replace("Satu  Ribu","Seribu");
	  }
	  kalimat=kalimat + " Rupiah";
	  return trim(kalimat);
};
function isNumber(x) 
{ 
  return ( (typeof x === typeof 1) && (null !== x) && isFinite(x) );
}
