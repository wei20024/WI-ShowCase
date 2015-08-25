package com.huawei.showcase.interact.util;

import java.security.cert.X509Certificate;

import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.cxf.configuration.jsse.TLSClientParameters;
import org.apache.cxf.jaxrs.client.WebClient;
import org.apache.cxf.transport.http.HTTPConduit;

public class WebClientSSLCfg
{
  public static void setClientAuthentication(Object client)
  {
    HTTPConduit conduit = (HTTPConduit)WebClient.getConfig(client).getConduit();

    TLSClientParameters tlscp = conduit.getTlsClientParameters();
    if (tlscp == null)
    {
      tlscp = new TLSClientParameters();
    }
    tlscp.setDisableCNCheck(true);
    tlscp.setSecureSocketProtocol("SSL");

    TrustManager[] trustAllCerts = { new X509TrustManager()
    {
      public X509Certificate[] getAcceptedIssuers()
      {
        return new X509Certificate[0];
      }

      public void checkClientTrusted(X509Certificate[] certs, String authType)
      {
      }

      public void checkServerTrusted(X509Certificate[] certs, String authType)
      {
      }
    }
     };
    tlscp.setTrustManagers(trustAllCerts);
    conduit.setTlsClientParameters(tlscp);
  }
}