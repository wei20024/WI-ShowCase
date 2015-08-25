package com.huawei.showcase.rest.util;

import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;

import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.cxf.configuration.jsse.TLSClientParameters;
import org.apache.cxf.jaxrs.client.WebClient;
import org.apache.cxf.jaxrs.provider.json.JSONProvider;
import org.apache.cxf.transport.http.HTTPConduit;

import com.huawei.showcase.model.Token;
import com.huawei.showcase.model.request.UnsCommonReq;

public abstract class RestCommonUtils
{
  private static final long CALL_REST_TIMEOUT = 5000L;
  private static List<JSONProvider> providerList = new ArrayList<JSONProvider>();

  private static String acceptString = "application/json;charset=UTF-8";

  private static String typeString = "application/json;charset=UTF-8";

  static
  {
    initProviderList();
  }

  private static void initProviderList()
  {
    JSONProvider jsonProvider = new JSONProvider();
    jsonProvider.setSerializeAsArray(true);
    jsonProvider.setSupportUnwrapped(true);
    jsonProvider.setDropRootElement(true);
    jsonProvider.setDropCollectionWrapperElement(true);
    providerList.add(jsonProvider);
  }

  public static WebClient getHttpClient(String url)
  {
    WebClient client = WebClient.create(url, providerList);
    client.accept(new String[] { acceptString });
    client.type(typeString);
    HTTPConduit conduit = WebClient.getConfig(client).getHttpConduit();
    if (conduit != null)
    {
      conduit.getClient().setConnectionTimeout(CALL_REST_TIMEOUT);
      conduit.getClient().setReceiveTimeout(CALL_REST_TIMEOUT);
    }

    return client;
  }

  public static WebClient getHttpsClient(String url)
  {
    WebClient client = WebClient.create(url, providerList);
    client.accept(new String[] { acceptString });
    client.type(typeString);

    TLSClientParameters tlsParams = new TLSClientParameters();
    tlsParams.setSecureSocketProtocol("TLSv1");
    tlsParams.setDisableCNCheck(true);

    TrustManager[] trustAllCerts = 
      { new X509TrustManager()
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
    tlsParams.setTrustManagers(trustAllCerts);

    HTTPConduit conduit = WebClient.getConfig(client).getHttpConduit();
    if (conduit != null)
    {
      conduit.getClient().setConnectionTimeout(CALL_REST_TIMEOUT);
      conduit.getClient().setReceiveTimeout(CALL_REST_TIMEOUT);
      conduit.setTlsClientParameters(tlsParams);
    }

    return client;
  }
  public static void setCommonRestRequest(UnsCommonReq req, Token token)
  {
    if ((req != null) && (token != null))
    {
      req.setRequestType("api");
      req.setTokenId(token.getAuthTokenId());
      req.setCurrentIp(token.getCurrentIp());
    }
    else if (req != null)
    {
      req.setRequestType("api");
    }
  }
}