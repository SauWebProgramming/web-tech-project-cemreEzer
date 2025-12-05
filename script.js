const MEDIA_DATA_URL = './data.json';  // Kendi oluşturduğum dosya yolu
const mediaListContainer = document.getElementById('media-list');  //index.html'deki ana listeleme alanı ID'si
const searchInput=document.getElementById('search-input');
const categoryFilter=document.getElementById('category-filter');
const detailSection= document.getElementById('media-detail');
const showAllBtn =document.getElementById('show-all-btn');
const showFavoritesBtn = document.getElementById('show-favorites-btn')
const yearFilter = document.getElementById('year-filter');


let allMediaData =[];  // Filtreleme ve arama için tüm veriyi burda tutacağım

//  .... fetchMediaData ve renderMediaList fonksiyonları burada kalıyor...
//  yeni fonksiyon: kategori filtresini oluşturma

const populateCategoryFilter = (mediaData) => {
  if (!categoryFilter) return; // güvenlik: element yoksa çık

  // 1) Dropdown'u sıfırla ve varsayılan seçeneği koy
  categoryFilter.innerHTML = '<option value="all">Tüm Kategoriler</option>';

  // 2) Benzersiz kategorileri al (null/undefined filtrele)
const uniqueCategories = [...new Set(
    (mediaData || []).map(m => m.kategori).filter(Boolean)
)];


  // 3) Her kategori için option oluşturup ekle
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
};




const filterAndRenderMedia = () => {
    const q = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const year = yearFilter.value;


    let filtered = allMediaData;

    if (q) {
        filtered = filtered.filter(m =>
            m.baslik.toLowerCase().includes(q)
        );
    }

    if (category !== "all") {
        filtered = filtered.filter(m => m.kategori === category);
    }
     if (year !== "all") {
        filtered = filtered.filter(m => m.yil == year);
    }

    renderMediaList(filtered);
};

//Asenkron veri çekme fonksiyonu
const fetchMediaData = async () => {

         try{
            // 1.fetch() API ile yerel dosyayı çekme
            const response = await fetch (MEDIA_DATA_URL);

            if(!response.ok){
                throw new Error(`HTTP hata! Durum kodu: ${response.status} `);
            }
    
                // 2. Dönen JSON verisini Javascript objesine dönüştürme [cite:50]
               const data =await response.json();

               allMediaData = data;  // tüm veriyi global değişkende saklar



                    // YENİ: Veri çekildikten sonra filtreyi doldur
                     populateCategoryFilter(allMediaData); 
                     populateYearFilter(allMediaData);

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
        mediaCard.innerHTML= `
        <img src="${media.resimUrl}" class="poster" alt="${media.baslik}">

        <h2>${media.baslik}</h2>
        <p>Yıl: ${media.yil} | Kategori: ${media.kategori}</p>
        <p>Puan: ${media.puan}</p>

        <button onclick="showDetails(${media.id})">Detayları Gör</button>

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

        // UI güncellemesi — buton yazısını değiştirme
    const buttons = document.querySelectorAll(`button[data-id="${id}"]`);
    buttons.forEach(btn => {
        btn.textContent = favorites.includes(id) 
            ? '⭐️ Favorilerden Çıkar' 
            : '☆ Favoriye Ekle';
    });

        


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





const populateYearFilter = (mediaData) => {
    if (!yearFilter) return;

    // dropdown'u sıfırla
    yearFilter.innerHTML = `<option value="all">Tüm Yıllar</option>`;

    // tüm yılları benzersiz al
    const uniqueYears = [...new Set(mediaData.map(m => m.yil))].sort((a, b) => b - a);

    uniqueYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
};



// sadece favori filmleri ekrana basar 
    const renderFavorites=()=>{
        mediaListContainer.innerHTML='';
        const favoriteIds = getFavorites();

        if(favoriteIds.length===0){
            mediaListContainer.innerHTML = `
            <div style="text-align:center; padding:30px;">
                <h2>⭐ Favori listeniz boş</h2>
                <p>Beğendiğiniz filmleri favorilere ekleyebilirsiniz.</p>
            </div>
        `;
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

           yearFilter.addEventListener('change', filterAndRenderMedia);
           // sekme dinleyicilerini ekle
           setupTabListeners();
     };




const showDetails = (id) => {
    const media = allMediaData.find(m => m.id === id);
    
    if (!media) {
        detailSection.innerHTML = '<p>Film bulunamadı.</p>';
        detailSection.classList.remove('hidden');
        return;
    }
    
    detailSection.innerHTML = `
        <div class="detail-card">
            <img src="${media.resimUrl}" alt="${media.baslik}" class="detail-poster">
            
            <h2>${media.baslik} (${media.yil})</h2>
            <p><strong>Kategori:</strong> ${media.kategori}</p>
            <p><strong>Puan:</strong> ${media.puan} / 10</p>
            <p><strong>Konu:</strong> ${media.konu}</p>

            <button onclick="hideDetails()">Listeye Geri Dön</button>
        </div>
    `;
    
    detailSection.classList.remove('hidden');
    mediaListContainer.classList.add('hidden');
    document.getElementById('controls').classList.add('hidden');
    
    // 🔥 **DETAYLARA YUMUŞAK ANİMASYONLA OTOMATİK KAYDIR**
    detailSection.scrollIntoView({ behavior: "smooth" });

};



// Detay ekranını gizler
const hideDetails = () => {
    detailSection.classList.add('hidden');
    mediaListContainer.classList.remove('hidden'); // Listeyi göster
    
    // Kontrol/Navigasyon alanlarını tekrar göster
    document.getElementById('controls').classList.remove('hidden');
    filterAndRenderMedia();
    document.getElementById('tabs').classList.remove('hidden');
};

