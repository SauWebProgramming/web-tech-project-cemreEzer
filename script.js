const MEDİA_DATA_URL = './data.json';  // Kendi oluşturduğum dosya yolu
const mediaListContainer = documentGetElementById('media-List');  //index.html'deki ana listeleme alanı ID'si

let allMediaData =[];  // Filtreleme ve arama için tüm veriyi burda tutacağım

//Asenkron veri çekme fonksiyonu
const fetchMediaData = async () => {
         try{
            // 1.fetch() API ile yerel dosyayı çekme
            const response = await fetch (MEDİA_DATA_URL);

            if(!response.ok){
                throw new Error(`HTTP hata! Durum kodu: ${response.status} `);
            }
    
    

                // 2. Dönen JSON verisini Javascript objesine dönüştürme [cite:50]
                   const data =await response.json();

                      allMediaData = data;  // tüm veriyi global değişkende saklar

                      // veri başarıyla çekildi Şimdi listeleme fonksyonunu çağırırız
                            renderMediaList(allMediaData);


        }
        
        catch(error){
            console.error("veri çekilriken hata oluştu : " ,error);
            //Kullanıcıya bir hata mesajı gösterir.
            if(mediaListContainer){
                mediaListContainer.innerHTML = `<p style = "color:red ;" > veri yüklenemedi: ${error.message} <p>`;
            }
        }
};

//Medya listesini DOM'a (arayüze) basacak fonksiyon 

const renderMediaList = (mediaArray) => {
    if(mediaListContainer){
        mediaListContainer.innerHTML = ''; // önceki içeriği temizler

        if(mediaArray.length===0){
            mediaListContainer.innerHTML = '<p>gösterilecek medya bulunamadı.</p>';
            return;
        }
        mediaArray.forEach(media=> {
            // her bir medya için bir kart (<div>) oluşturup içeriğini doldururuz  
            const mediaCard = document.createElement('div');
        mediaCard.classList.add('media-card'); // css ile stil vermek için 
        mediaCard.innerHTML=`
        <h2>${media.baslik}</h2>
        <p>Yıl: ${media.yil} | Kategori: ${media.kategori}</p>
        <button onclick="shaowDetails(${media.id})">detayları gör</button>
        `;
        mediaListContainer.appendChild(mediaCard);
        });
    };

    // uygulamayı başlat
    fetchMediaData();

}
