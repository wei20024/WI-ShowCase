package com.huawei.showcase.common.util.crypto;

import java.io.FileInputStream;
import java.io.ObjectInputStream;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SealedObject;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.apache.xml.security.utils.Base64;

import com.huawei.showcase.common.util.log.LogUtils;

public final class AesEncrypter
{
  private static final String DESKEY_FILENAME = "deskey.skey";
  private static final String CIPHER_ALGORITHM = "AES/ECB/PKCS5Padding";
  private static final byte[] EN_FILE_BYTES = { -84, -64, -104, 56, -6, 126, 112, -69, 1, -65, -108, 34, -107, 88, -113, -1 };
  private static final String ENCRYPT_FILE_ALGORITHM = "AES";

  private static String keyPath;
  private static SecretKey secretKey ;

  static
  {
    ClassLoader cL = Thread.currentThread().getContextClassLoader();
    if (cL == null)
    {
      cL = AesEncrypter.class.getClassLoader();
    }

    URL deskeyURL = cL.getResource(DESKEY_FILENAME);

    if (deskeyURL != null)
    {
      keyPath = deskeyURL.getPath();
    }
    secretKey = readEnKeyFile(keyPath);
  }

  public static String encrypt(String str)
  {
    if (str == null)
    {
      LogUtils.LOG.error("encrypt():str is null");
      return null;
    }
    if (secretKey == null)
    {
      LogUtils.LOG.error("encrypt():initialize failed");
      return null;
    }

    try
    {
      byte[] data = str.getBytes("utf-8");

      Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);

      cipher.init(1, secretKey);
      byte[] encrypt = cipher.doFinal(data);
      return Base64.encode(encrypt);
    }
    catch (NoSuchAlgorithmException e)
    {
      LogUtils.LOG.error(e);
    }
    catch (NoSuchPaddingException e)
    {
      LogUtils.LOG.error(e);
    }
    catch (InvalidKeyException e)
    {
      LogUtils.LOG.error(e);
    }
    catch (IllegalBlockSizeException e)
    {
      LogUtils.LOG.error(e);
    }
    catch (Exception e)
    {
      LogUtils.LOG.error(e);
    }
    return null;
  }

  public static String decrypt(String str)
  {
    if (str == null)
    {
      LogUtils.LOG.error("decrypt():str is null");
      return null;
    }

    if (secretKey == null)
    {
      LogUtils.LOG.error("decrypt():initialize failed");
      return null;
    }

    try
    {
      byte[] data = Base64.decode(str);

      Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);

      cipher.init(2, secretKey);
      byte[] decrypt = cipher.doFinal(data);
      return new String(decrypt, "utf-8");
    }
    catch (NoSuchAlgorithmException e)
    {
      LogUtils.LOG.error(e);
    }
    catch (NoSuchPaddingException e)
    {
      LogUtils.LOG.error(e);
    }
    catch (InvalidKeyException e)
    {
      LogUtils.LOG.error(e);
    }
    catch (IllegalBlockSizeException e)
    {
      LogUtils.LOG.error(e);
    }
    catch (BadPaddingException e)
    {
      LogUtils.LOG.error(e);
    }
    catch (Exception e)
    {
      LogUtils.LOG.error(e);
    }

    return null;
  }

  public static String getBASE64(byte[] bArr)
  {
    if (bArr == null)
    {
      return null;
    }
    return Base64.encode(bArr);
  }

  public static String encodeBASE64(String con)
  {
    if (con == null)
    {
      return null;
    }
    try
    {
      return Base64.encode(con.getBytes("UTF8"));
    }
    catch (UnsupportedEncodingException e) {
    }
    return null;
  }

  public static String decodeBASE64(String encoded)
  {
    if (encoded == null)
    {
      return null;
    }
    try
    {
      byte[] result = Base64.decode(encoded);
      return new String(result, "utf-8");
    }
    catch (Exception e)
    {
      LogUtils.LOG.error(e);
    }return null;
  }


  public static SecretKey readEnKeyFile(String filename)
  {
    if ((filename == null) || (filename.isEmpty()))
    {
      LogUtils.LOG.error("filename is invalid");
      return null;
    }

    LogUtils.LOG.info("filename = " + filename);

    FileInputStream fileInput = null;
    ObjectInputStream objInput = null;
    try
    {
      fileInput = new FileInputStream(filename);
      objInput = new ObjectInputStream(fileInput);
      SealedObject sealedObj = (SealedObject)objInput.readObject();

      SecretKey rootKey = new SecretKeySpec(EN_FILE_BYTES, ENCRYPT_FILE_ALGORITHM);
      Cipher decrypt = Cipher.getInstance(ENCRYPT_FILE_ALGORITHM);
      decrypt.init(2, rootKey);

      SecretKey key = (SecretKey)sealedObj.getObject(decrypt);
      return key;
    }
    catch (Exception e)
    {
      LogUtils.LOG.error("failed to readEnKeyFile", e);
      return null;
    }
    finally
    {
      if (objInput != null)
      {
        try
        {
          objInput.close();
        }
        catch (Exception e)
        {
          LogUtils.LOG.error(e);
        }
      }

      if (fileInput != null)
      {
        try
        {
          fileInput.close();
        }
        catch (Exception e)
        {
          LogUtils.LOG.error(e);
        }
      }
    }
  }
}