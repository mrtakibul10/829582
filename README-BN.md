# FF BD Player UID Lookup

এটি FF BD Fan Project-এর জন্য একটি আলাদা UID profile lookup ওয়েব অ্যাপ। এটি আসল Free Fire গেমে লগইন করে না, ম্যাচে যুক্ত করে না, এবং Garena-এর অফিসিয়াল API নয়।

## কী কাজ করে
- UID ও region দিয়ে third-party community API-তে profile lookup request পাঠায়।
- nickname, level, region, likes, rank, guild ইত্যাদি পাওয়া গেলে দেখায়।
- API key browser-এ প্রকাশ না করে Node.js server-এ রাখে।
- basic rate limit ও UID validation আছে।

## প্রয়োজন
- Node.js 18 বা তার পরের সংস্করণ
- Profile provider-এর API key
- Render-এর মতো Node Web Service host

## লোকালি চালানো
1. এই ZIP extract করো।
2. `.env.example` কপি করে `.env` বানাও।
3. `.env` ফাইলে `FREEFIRE_API_KEY`-এ provider থেকে পাওয়া নিজের API key বসাও।
4. Terminal-এ `npm install` চালাও।
5. `npm start` চালাও।
6. Browser-এ `http://localhost:3000` খোলো।

## Render-এ চালানো
- New → Web Service → GitHub repository connect
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  - `FREEFIRE_API_BASE` = `https://developers.freefirecommunity.com/api/v1`
  - `FREEFIRE_API_KEY` = provider-এর API key
  - `APP_USER_AGENT` = `FFBDUIDLookup/1.0`
- Deploy হওয়ার পর service URL খুলে UID search করো।

## API provider setup
এই starter-এ Free Fire Community API-এর `/info` endpoint-এর format ব্যবহার করা হয়েছে। তাদের বর্তমান documentation ও terms দেখে নিজে API key সংগ্রহ করতে হবে। Provider-এর availability, pricing, region support ও limits বদলাতে পারে:
https://developers.freefirecommunity.com/en/docs

## গুরুত্বপূর্ণ সীমাবদ্ধতা
- এটি unofficial community data provider ব্যবহার করে; Garena-এর অনুমোদিত official integration নয়।
- API key না দিলে live lookup হবে না।
- API down, rate limit, region mismatch বা provider change হলে lookup কাজ নাও করতে পারে।
- Profile তথ্য public/available থাকা ও provider-এর response-এর ওপর নির্ভরশীল।
- কোনো Free Fire password, OTP, access token বা account credential সংগ্রহ/শেয়ার করো না।
- এটি original Free Fire APK-এর server address বদলায় না এবং আসল Free Fire ম্যাচে connect করায় না।
- কোনো fake/demo profile-কে real data হিসেবে দেখায় না।
