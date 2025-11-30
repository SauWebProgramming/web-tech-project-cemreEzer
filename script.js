const MEDİA_DATA_URL = './data.json';  // Kendi oluşturduğum dosya yolu
const mediaListContainer = document.getElementById('media-List');  //index.html'deki ana listeleme alanı ID'si
const searchInput=document.getElementById('search-input');
const categoryFilter=document.getElementById('category-filter');
const detailSection= document.getElementById('media-detail');
const showAllBtn =document.getElementById('show-all-btn');
const showFavoritesBtn = document.getElementById('show-favorites-btn')

let allMediaData =[];  // Filtreleme ve arama için tüm veriyi burda tutacağım

//  .... fetchMediaData ve renderMediaList fonksiyonları burada kalıyor...
//  yeni fonksiyon: kategori filtresini oluşturma
const populateCategoryFilter=(mediaData)=>{
    // 1. benzersiz kategorileri bulma (set objesi kullanarak tekrarları önleriz)
    const uniqueCategories=new Set(mediaData.map(media=>media.kategori));

    //  2. iltr elamanını doldurma
    uniqueCategories.forEach(category=> {
        const option=document.createElement(`option`);
        option.value=category;
        option.textContent=category;
        categoryFilter.appendChild(option);
    });

};

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



                    // YENİ: Veri çekildikten sonra filtreyi doldur
                     populateCategoryFilter(allMediaData); 
               

                    // veri başarıyla çekildi Şimdi listeleme fonksyonunu çağırırız
                     renderMediaList(allMediaData);

                    // 4. Arama ve filtreleme için olay dinleyicilerini kur
                    setupEventListeners();
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
            const isFavorite = isMediaFavorite(media.id);


            const mediaCard = document.createElement('div');
        mediaCard.classList.add('media-card'); // css ile stil vermek için 
        mediaCard.innerHTML=`
        <h2>${media.baslik}</h2>
        <p>Yıl: ${media.yil} | Kategori: ${media.kategori}</p>
        <p>Puan: ${media.puan}</p>
        <button onclick="showDetails(${media.id})">Detayları gör</button>
        
        <button class="favorite-btn" onclick="toggleFavorite(${media.id})" data-id="${media.id}">     
        ${isFavorite ? '⭐️ Favorilerden Çıkar' : '☆ Favoriye Ekle'}
        </button>
        
        `;

        mediaListContainer.appendChild(mediaCard);
        });
    };

}
  // uygulamayı başlat
    fetchMediaData();

// Local Storage'dan favori ID'lerini çeker

    const getFavorites =() => {
        //Local Storage'da "favorites" adında bir veri varsa çek, yoksa boş dizi döndür
        const favorites =localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    };
    //Filmin favori olup olmadığını kontrol eder
    const isMediaFavorite = (id) =>{
        return getFavorites().includes(id);
    };
    // Favori durumunu değiştirir
    const toggleFavorite =(id) =>{
        let favorites =getFavorites();
        const index= favorites.indexOf(id);
    
        if(index=== -1){
            //favori değilse ekle
            favorites.push(id);
        }
        else{
            //favoriyse çıkar
            favorites.splice(index, 1);
        }

        //local Storage'ı güncelle
        localStorage.setItem('favorites',JSON.stringify(favorites));

        //liste güncel favori durumunu göstermesi için yeniden basılır
        //eğer şu an favoriler sekmesindeysek favorileri yeniden render et 
        if(showFavoritesBtn.classList.contains('active')){
            renderFavorites();
        }
        else{
            //aksi halde tüm filmleri yeniden render et (buton yazsının değişmesi için)
            filterAndRenderMedia();
        }
    };

// sadece favori filmleri ekrana basar 
    const renderFavorites=()=>{
        mediaListContainer.innerHTML='';
        const favoriteIds = getFavorites();

        if(favoriteIds.length===0){
            mediaListContainer.innerHTML = '<p>Favori listeniz boş.</p>';
            return;
        }

        // favori id'lerine sahip filmleri tüm veride filtrele
        const favoriteMedia = allMediaData.filter(media=>favoriteIds.includes(media.id));

        //favori filmleri listeler
        renderMediaList(favoriteMedia);

    };
     // sekmeleri değiştiren fonksiyon
     const switchTab=(tabName)=>{
        if(tabName==='all'){
            showAllBtn.classList.add('active');
            showFavoritesBtn.classList.remove('active');
            filterAndRenderMedia();   // tüm filmleri filtrele ve göster
        }
        else if(tabName==='favorites'){
            showFavoritesBtn.classList.add('active');
            showAllBtn.classList.remove('active');
            renderFavorites();  // sadece favorileri göster
        }
     };

     // Sekme dinleyicilerini kur
const setupTabListeners = () => {
    showAllBtn.addEventListener('click', () => switchTab('all'));
    showFavoritesBtn.addEventListener('click', () => switchTab('favorites'));
};

     // setupEventListeners fonksiyonunu güncelleyin (Tab dinleyicilerini eklemek için)
     const setupEventListeners=()=>{
        // mevcut dinleyiciler
           searchInput.addEventListener('input', filterAndRenderMedia);
           categoryFilter.addEventListener('change',filterAndRenderMedia);

           // sekme dinleyicilerini ekle
           setupTabListeners();
     };





     
// Film detaylarını gösterir
const showDetails = (id) => {
    const media = allMediaData.find(m => m.id === id);
    
    if (!media) {
        detailSection.innerHTML = '<p>Film bulunamadı.</p>';
        detailSection.classList.remove('hidden');
        return;
    }
    
    // Detay kartını oluştur
    detailSection.innerHTML = `
        <div class="detail-card">
            <h2>${media.baslik} (${media.yil})</h2>
            <p><strong>Kategori:</strong> ${media.kategori}</p>
            <p><strong>Puan:</strong> ${media.puan} / 10</p>
            <p><strong>Özet:</strong> ${media.ozet}</p>
            <button onclick="hideDetails()">Listeye Geri Dön</button>
        </div>
    `;
    
    // Detay alanını göster ve listeyi gizle
    detailSection.classList.remove('hidden');
    mediaListContainer.classList.add('hidden'); // Listeyi gizle
    
    // Kontrol/Navigasyon alanlarını da gizlemek isteyebilirsiniz
    document.getElementById('controls').classList.add('hidden');
    document.getElementById('tabs').classList.add('hidden');
};

// Detay ekranını gizler
const hideDetails = () => {
    detailSection.classList.add('hidden');
    mediaListContainer.classList.remove('hidden'); // Listeyi göster
    
    // Kontrol/Navigasyon alanlarını tekrar göster
    document.getElementById('controls').classList.remove('hidden');
    document.getElementById('tabs').classList.remove('hidden');
};

