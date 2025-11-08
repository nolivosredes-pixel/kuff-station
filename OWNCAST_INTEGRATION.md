# Owncast Integration Guide for KUFF DJ

This guide explains how to integrate your existing Owncast server with the KUFF website to stream live content on kuffdj.net/live.

## Overview

Owncast is a self-hosted live streaming server. This integration allows:
- Your Owncast server to be the streaming source
- Automatic detection when your stream goes live
- Display on kuffdj.net/live page
- Use of Owncast's HLS stream for browser playback

## Prerequisites

- Owncast server running (you already have this)
- Access to Owncast admin panel
- Owncast server URL (e.g., https://stream.kuffdj.net or http://your-server-ip:8080)

## Step 1: Get Your Owncast Information

You need these details from your Owncast server:

### A. Owncast Server URL
- Example: `https://stream.kuffdj.net` or `http://your-ip:8080`
- This is where your Owncast web interface is hosted

### B. HLS Stream URL
- Default: `{YOUR_OWNCAST_URL}/hls/stream.m3u8`
- Example: `https://stream.kuffdj.net/hls/stream.m3u8`

### C. RTMP Streaming Credentials (for OBS)
1. Log into Owncast admin panel
2. Go to "Configuration" → "Server Setup"
3. Find your RTMP URL (usually `rtmp://your-server:1935`)
4. Find your Stream Key

### D. Admin API Access (Optional for auto-detection)
1. Go to Owncast admin → "Integrations" → "Access Tokens"
2. Create a new access token
3. Save the token securely

## Step 2: Configure Owncast CORS Settings

To allow kuffdj.net to embed your stream:

1. SSH into your Owncast server
2. Edit Owncast configuration file (usually `/var/owncast/data/config.yaml`)
3. Add CORS configuration:

```yaml
federation:
  enabled: true

instanceDetails:
  extraPageBodyContent: |
    <script>
      // Allow embedding from kuffdj.net
    </script>

# Important: Make sure your stream is publicly accessible
videoSettings:
  videoQualityVariants:
    - isVideoPassthrough: false
      videoBitrate: 3000
      outputStreamBitrate: 3000
      encoderPreset: veryfast
```

4. Restart Owncast: `sudo systemctl restart owncast`

## Step 3: Test Your Owncast Stream

1. Start streaming to your Owncast server using OBS:
   - Server: `rtmp://your-owncast-server:1935`
   - Stream Key: (from Owncast admin)

2. Verify stream is working:
   - Visit: `https://your-owncast-url`
   - You should see your live stream

3. Test HLS endpoint directly:
   - Visit: `https://your-owncast-url/hls/stream.m3u8`
   - Should download/display an m3u8 playlist file

## Step 4: Configuration for KUFF Website

Provide these details to configure KUFF:

```
OWNCAST_SERVER_URL=https://stream.kuffdj.net
OWNCAST_HLS_URL=https://stream.kuffdj.net/hls/stream.m3u8
OWNCAST_API_URL=https://stream.kuffdj.net/api/status
OWNCAST_ADMIN_TOKEN=your-access-token-here (optional)
```

## Step 5: How It Works

Once integrated:

1. **Streaming Workflow:**
   - You stream from OBS to Owncast RTMP server
   - Owncast transcodes to HLS
   - KUFF website detects stream is live via Owncast API
   - KUFF embeds HLS stream from Owncast
   - Viewers watch on kuffdj.net/live

2. **Auto-Detection:**
   - KUFF polls Owncast `/api/status` endpoint every 10 seconds
   - When `online: true`, stream appears on /live page
   - When stream ends, /live page shows "offline" message

3. **Playback:**
   - Uses HLS.js to play Owncast HLS stream
   - Low latency mode enabled
   - Automatic quality switching
   - Works on all modern browsers

## Troubleshooting

### Stream not showing on KUFF website
- Check if Owncast is publicly accessible (not behind firewall)
- Verify CORS is configured correctly
- Check browser console for errors
- Verify HLS URL is correct

### High latency
- Reduce Owncast transcoding segments in admin panel
- Use lower quality settings for faster encoding
- Enable low-latency mode in Owncast settings

### Connection errors
- Make sure Owncast is using HTTPS (required for modern browsers)
- Check if port 1935 (RTMP) is open on firewall
- Verify Owncast is running: `sudo systemctl status owncast`

## Security Notes

1. **Never share your Stream Key publicly**
2. Use HTTPS for Owncast (Let's Encrypt is free)
3. Keep Owncast updated to latest version
4. Use strong admin password
5. Admin API token should be kept secret

## Example OBS Settings

For best quality streaming to Owncast:

- **Output Mode:** Advanced
- **Encoder:** x264 or Hardware (NVENC/QuickSync)
- **Bitrate:** 3000-5000 kbps
- **Keyframe Interval:** 2
- **Preset:** veryfast (CPU) or Quality (Hardware)
- **Profile:** high
- **Server:** rtmp://your-owncast-server:1935
- **Stream Key:** (from Owncast admin)

## Next Steps

After providing your Owncast details, the KUFF website will be updated to:
1. Use your Owncast HLS stream
2. Display RTMP credentials from Owncast (instead of generating them)
3. Auto-detect when stream is live
4. Embed stream on /live page

---

**Ready to integrate?** Provide these details:
- Owncast Server URL
- Confirm HLS endpoint is accessible
- (Optional) Admin API token for auto-detection
