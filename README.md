# Setup guide

## use conda ( just use miniconda3 in pycharm or the one i gave on whatsapp )
### install python requirements for server by

```bash
cd server
pip install -r requirements.txt
python app.py
```

### install npm and initialise client by
```bash
conda install nodejs
cd client
npm init
npm install
npm run dev
```

### you also need redis
[Windows](https://github.com/MicrosoftArchive/redis/releases)
[MAC](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-mac-os/)

#### *note: make sure tools like proxifier are off

#### *note: if port on opening is not at localhost:3000, force stop the ongoing process
####       by the following commands in command prompt:

#### 1. netstat -aon | findstr :3000
#### 2. taskkill /PID <PID> /F


