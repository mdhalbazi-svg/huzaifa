import React, { useMemo, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, ScrollView,
  StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';

const LANG = {
  ur: { title:'اشتہار بناؤ', subtitle:'اپنے کاروبار کے لیے خوبصورت اشتہار تیار کریں', search:'ٹیمپلیٹ تلاش کریں', shop:'کاروبار / دکان کا نام', offer:'اشتہار کی تفصیل یا آفر', price:'قیمت', oldPrice:'پرانI قیمت', phone:'فون نمبر', photo:'تصویر منتخب کریں', logo:'لوگو یا تصویر شامل کریں', share:'اشتہار شیئر کریں', save:'', all:'تمام', choose:'ٹیمپلیٹ منتخب کریں', categories:'کاروبار کی اقسام', noResults:'کوئی ٹیمپلیٹ نہیں ملا', },
  ps: { title:'اعلان جوړ کړئ', subtitle:'د خپل کاروبار لپاره ښکلی اعلان جوړ کړئ', search:'ټیمپلیټ ولټوئ', shop:'د کاروبار / دوکان نوم', offer:'د اعلان تفصیل یا وړاندیز', price:'بیه', oldPrice:'پخوانۍ بیه', phone:'د تلیفون شمېره', photo:'انځور وټاکئ', logo:'لوګو یا انځور زیات کړئ', share:'اعلان شریک کړئ', all:'ټول', choose:'ټیمپلیټ وټاکئ', categories:'د کاروبار ډولونه', noResults:'ټیمپلیټ ونه موندل شو' },
  en: { title:'Ad Maker', subtitle:'Create a professional ad for your business', search:'Search templates', shop:'Business / shop name', offer:'Ad description or offer', price:'Price', oldPrice:'Old price', phone:'Phone number', photo:'Choose image', logo:'Add logo or image', share:'Share advertisement', all:'All', choose:'Choose a template', categories:'Business categories', noResults:'No templates found' }
};

const CATEGORIES = [
  { id:'food', ur:'ہوٹل اور کھانے', ps:'هوټل او خواړه', en:'Food & restaurants', base:['#8E1B1B','#F5C451'] },
  { id:'fashion', ur:'کپڑے اور فیشن', ps:'جامې او فېشن', en:'Fashion & clothing', base:['#51245F','#F6C9DC'] },
  { id:'electronics', ur:'موبائل اور الیکٹرانکس', ps:'موبایل او برېښنايي توکي', en:'Electronics', base:['#123B70','#64D8E8'] },
  { id:'property', ur:'پراپرٹی اور تعمیرات', ps:'جایداد او ودانیز کارونه', en:'Property & construction', base:['#174B43','#E6C77A'] },
  { id:'honey', ur:'شہد اور غذائی مصنوعات', ps:'شات او خوراکي توکي', en:'Honey & food products', base:['#74400B','#FFD36A'] },
  { id:'beauty', ur:'بیوٹی اور کاسمیٹکس', ps:'ښکلا او کاسمیټکس', en:'Beauty & cosmetics', base:['#8C315F','#F9C4D8'] },
  { id:'education', ur:'تعلیم اور اکیڈمیز', ps:'زده کړه او اکاډمۍ', en:'Education', base:['#173D76','#F2D36B'] },
  { id:'auto', ur:'گاڑیاں اور آٹو پارٹس', ps:'موټر او پرزې', en:'Cars & auto parts', base:['#343B46','#F2A65A'] },
  { id:'services', ur:'کاروباری خدمات', ps:'سوداګریز خدمتونه', en:'Business services', base:['#234C75','#B9D7F2'] },
  { id:'travel', ur:'ٹریول اور سیاحت', ps:'سفر او سیاحت', en:'Travel & tourism', base:['#087E8B','#F5D76E'] },
  { id:'sale', ur:'ڈسکاؤنٹ اور آفرز', ps:'تخفیف او وړاندیزونه', en:'Discounts & offers', base:['#B51F35','#FFE36E'] },
  { id:'general', ur:'عمومی کاروباری اشتہارات', ps:'عمومي سوداګریز اعلانونه', en:'General business', base:['#303F9F','#D9E2FF'] },
];

const VARIANTS = [
  ['#B71C1C','#FFD54F'],['#0D47A1','#80DEEA'],['#1B5E20','#C5E1A5'],['#4A148C','#E1BEE7'],['#E65100','#FFE0B2'],
  ['#006064','#80CBC4'],['#263238','#FFCC80'],['#880E4F','#F8BBD0'],['#33691E','#DCEDC8'],['#283593','#C5CAE9'],
  ['#5D4037','#D7CCC8'],['#AD1457','#F48FB1'],['#1565C0','#BBDEFB'],['#2E7D32','#A5D6A7'],['#EF6C00','#FFCC80'],
  ['#4527A0','#D1C4E9'],['#00838F','#B2EBF2'],['#C62828','#FFCDD2'],['#37474F','#CFD8DC'],['#827717','#F0F4C3'],
  ['#6A1B9A','#CE93D8'],['#0277BD','#B3E5FC'],['#558B2F','#DCE775'],['#AD4B00','#FFE082'],['#283747','#F7DC6F']
];

const HEADINGS = {
  ur:['بڑی آفر','نئی آمد','خصوصی رعایت','ابھی خریدیں','بہترین انتخاب','محدود مدت','شاندار پیشکش','معیاری مصنوعات','آج ہی تشریف لائیں','خاص اعلان'],
  ps:['لوی وړاندیز','نوي توکي','ځانګړی تخفیف','همدا اوس واخلئ','غوره انتخاب','محدوده موده','ځلانده وړاندیز','کیفیت لرونکي توکي','نن راشئ','ځانګړی اعلان'],
  en:['BIG OFFER','NEW ARRIVAL','SPECIAL DISCOUNT','SHOP NOW','BEST CHOICE','LIMITED TIME','GREAT DEAL','PREMIUM QUALITY','VISIT TODAY','SPECIAL ANNOUNCEMENT']
};

// 12 categories × 25 editable visual variations = 300 templates.
const TEMPLATES = CATEGORIES.flatMap((cat, ci) =>
  Array.from({length:25}, (_, vi) => {
    const palette = VARIANTS[(ci * 7 + vi) % VARIANTS.length];
    const headingIndex = (ci + vi) % 10;
    return {
      id:`${cat.id}-${String(vi+1).padStart(2,'0')}`,
      category:cat.id, name:`${cat.en} ${vi+1}`,
      bg: vi % 3 === 0 ? palette[0] : (vi % 3 === 1 ? cat.base[0] : VARIANTS[(ci+vi+9)%25][0]),
      accent: vi % 2 === 0 ? palette[1] : cat.base[1],
      layout: vi % 4,
      head:{ ur:HEADINGS.ur[headingIndex], ps:HEADINGS.ps[headingIndex], en:HEADINGS.en[headingIndex] }
    };
  })
);

export default function App() {
  const [lang,setLang] = useState('ur');
  const [category,setCategory] = useState('all');
  const [query,setQuery] = useState('');
  const [tpl,setTpl] = useState(TEMPLATES[0]);
  const [shop,setShop] = useState('');
  const [offer,setOffer] = useState('');
  const [price,setPrice] = useState('');
  const [oldPrice,setOldPrice] = useState('');
  const [phone,setPhone] = useState('');
  const [photo,setPhoto] = useState(null);
  const shot = useRef(null);
  const t = LANG[lang];
  const rtl = lang !== 'en';

  const filtered = useMemo(() => TEMPLATES.filter(x => {
    const c = CATEGORIES.find(y=>y.id===x.category);
    const name = c ? c[lang] : '';
    return (category==='all' || x.category===category) &&
      (`${name} ${x.name} ${x.head[lang]}`.toLowerCase().includes(query.toLowerCase()));
  }),[category,query,lang]);

  const pick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes:['images'], quality:0.85 });
    if (!r.canceled) setPhoto(r.assets[0].uri);
  };
  const share = async () => {
    if (!shot.current) return;
    const uri = await shot.current.capture();
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
  };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={s.pad}>
        <View style={s.top}>
          <View style={s.langRow}>
            {['ur','ps','en'].map(k=><TouchableOpacity key={k} onPress={()=>setLang(k)} style={[s.langChip,lang===k&&s.langOn]}><Text style={[s.langText,lang===k&&s.white]}>{({ur:'اردو',ps:'پښتو',en:'English'})[k]}</Text></TouchableOpacity>)}
          </View>
          <Text style={[s.h1,rtl&&s.rtl]}>{t.title}</Text>
          <Text style={[s.sub,rtl&&s.rtl]}>{t.subtitle}</Text>
          <Text style={s.count}>{TEMPLATES.length} editable templates</Text>
        </View>

        <TextInput value={query} onChangeText={setQuery} placeholder={t.search} style={[s.search,rtl&&s.rtl]} />
        <Text style={[s.section,rtl&&s.rtl]}>{t.categories}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catRow}>
          <TouchableOpacity onPress={()=>setCategory('all')} style={[s.catChip,category==='all'&&s.catOn]}><Text style={[s.catText,category==='all'&&s.white]}>{t.all}</Text></TouchableOpacity>
          {CATEGORIES.map(c=><TouchableOpacity key={c.id} onPress={()=>setCategory(c.id)} style={[s.catChip,category===c.id&&s.catOn]}><Text style={[s.catText,category===c.id&&s.white]}>{c[lang]}</Text></TouchableOpacity>)}
        </ScrollView>

        <Text style={[s.section,rtl&&s.rtl]}>{t.choose} ({filtered.length})</Text>
        <View style={s.grid}>
          {filtered.map(x=><TouchableOpacity key={x.id} onPress={()=>setTpl(x)} style={[s.template,{backgroundColor:x.bg},tpl.id===x.id&&s.selected]}>
            <Text style={[s.tplHead,{color:x.accent}]}>{x.head[lang]}</Text>
            <View style={[s.tplLine,{backgroundColor:x.accent,width:x.layout===0?'80%':x.layout===1?'55%':'70%'}]} />
            <Text style={s.tplMini}>{x.layout%2===0?'YOUR BRAND':'YOUR OFFER'}</Text>
            <Text style={[s.tplNumber,{color:x.accent}]}>{x.id.split('-')[1]}</Text>
          </TouchableOpacity>)}
        </View>
        {filtered.length===0&&<Text style={s.empty}>{t.noResults}</Text>}

        <Text style={[s.section,rtl&&s.rtl]}>اشتہار کی تفصیلات</Text>
        <TextInput placeholder={t.shop} value={shop} onChangeText={setShop} style={[s.input,rtl&&s.rtl]} />
        <TextInput placeholder={t.offer} value={offer} onChangeText={setOffer} style={[s.input,rtl&&s.rtl]} />
        <View style={s.two}>
          <TextInput placeholder={t.price} value={price} onChangeText={setPrice} style={[s.input,s.half,rtl&&s.rtl]} />
          <TextInput placeholder={t.oldPrice} value={oldPrice} onChangeText={setOldPrice} style={[s.input,s.half,rtl&&s.rtl]} />
        </View>
        <TextInput placeholder={t.phone} value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={s.input} />
        <TouchableOpacity style={s.secondary} onPress={pick}><Text style={s.secondaryText}>{t.photo}</Text></TouchableOpacity>

        <Text style={[s.section,rtl&&s.rtl]}>اشتہار کا نمونہ</Text>
        <ViewShot ref={shot} options={{format:'png',quality:1}}>
          <View style={[s.ad,{backgroundColor:tpl.bg}]}>
            <Text style={[s.adHead,{color:tpl.accent}]}>{tpl.head[lang]}</Text>
            {photo ? <Image source={{uri:photo}} style={s.adImage} /> : <View style={[s.photoPlaceholder,{borderColor:tpl.accent}]}><Text style={{color:tpl.accent}}>YOUR PRODUCT PHOTO</Text></View>}
            <Text style={s.adShop}>{shop || (lang==='ur'?'آپ کے کاروبار کا نام':lang==='ps'?'ستاسو د کاروبار نوم':'YOUR BUSINESS NAME')}</Text>
            <Text style={s.adOffer}>{offer || 'Your offer goes here'}</Text>
            <View style={s.priceRow}>
              {!!oldPrice&&<Text style={s.oldPrice}>{oldPrice}</Text>}
              {!!price&&<Text style={[s.newPrice,{backgroundColor:tpl.accent,color:tpl.bg}]}>{price}</Text>}
            </View>
            <Text style={s.adPhone}>{phone}</Text>
          </View>
        </ViewShot>
        <TouchableOpacity style={s.share} onPress={share}><Text style={s.shareText}>{t.share}</Text></TouchableOpacity>
        <Text style={s.footer}>Ishtihar Banao • 300 editable design variations</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s=StyleSheet.create({
 root:{flex:1,backgroundColor:'#F4F5F8'},pad:{padding:16,paddingBottom:36,gap:13},
 top:{backgroundColor:'#fff',padding:16,borderRadius:18,gap:7},langRow:{flexDirection:'row',justifyContent:'center',gap:8},
 langChip:{paddingHorizontal:14,paddingVertical:8,borderRadius:20,backgroundColor:'#E9ECF2'},langOn:{backgroundColor:'#17243A'},langText:{color:'#25334A',fontWeight:'600'},white:{color:'#fff'},
 h1:{fontSize:26,fontWeight:'900',color:'#18243A'},sub:{fontSize:14,color:'#667085'},count:{fontSize:12,color:'#52627A',fontWeight:'700'},
 rtl:{textAlign:'right',writingDirection:'rtl'},search:{backgroundColor:'#fff',borderRadius:12,padding:13,fontSize:15,textAlign:'right'},
 section:{fontSize:17,fontWeight:'800',color:'#18243A',marginTop:5},catRow:{gap:8,paddingVertical:3},catChip:{paddingHorizontal:13,paddingVertical:10,backgroundColor:'#fff',borderRadius:20},catOn:{backgroundColor:'#17243A'},catText:{fontSize:13,color:'#25334A'},
 grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:10},template:{width:'31.5%',aspectRatio:0.78,borderRadius:12,padding:8,justifyContent:'center',alignItems:'center',gap:8,borderWidth:3,borderColor:'transparent'},selected:{borderColor:'#F5A623'},
 tplHead:{fontSize:13,fontWeight:'900',textAlign:'center'},tplLine:{height:5,borderRadius:5},tplMini:{color:'#fff',fontSize:8,fontWeight:'800'},tplNumber:{fontSize:12,fontWeight:'900'},
 empty:{textAlign:'center',padding:20,color:'#667085'},input:{backgroundColor:'#fff',borderRadius:11,padding:13,fontSize:15,borderWidth:1,borderColor:'#E2E6ED'},two:{flexDirection:'row',gap:8},half:{flex:1},
 secondary:{backgroundColor:'#E7ECF4',padding:14,borderRadius:11,alignItems:'center'},secondaryText:{fontWeight:'700',color:'#1E3555'},
 ad:{padding:22,alignItems:'center',gap:12,minHeight:420,justifyContent:'center'},adHead:{fontSize:34,fontWeight:'900',textAlign:'center'},adImage:{width:220,height:170,borderRadius:14,resizeMode:'cover'},photoPlaceholder:{width:220,height:145,borderWidth:2,borderStyle:'dashed',borderRadius:14,alignItems:'center',justifyContent:'center'},adShop:{fontSize:25,color:'#fff',fontWeight:'900',textAlign:'center'},adOffer:{fontSize:18,color:'#fff',textAlign:'center'},priceRow:{flexDirection:'row',alignItems:'center',gap:10},oldPrice:{color:'#fff',fontSize:17,textDecorationLine:'line-through'},newPrice:{fontSize:24,fontWeight:'900',paddingHorizontal:17,paddingVertical:7,borderRadius:10,overflow:'hidden'},adPhone:{fontSize:18,color:'#fff',fontWeight:'700'},
 share:{backgroundColor:'#128C55',padding:15,borderRadius:12,alignItems:'center'},shareText:{color:'#fff',fontSize:16,fontWeight:'800'},footer:{textAlign:'center',fontSize:11,color:'#8992A2',marginTop:8}
});
