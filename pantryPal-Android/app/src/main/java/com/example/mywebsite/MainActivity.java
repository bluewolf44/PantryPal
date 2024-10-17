package com.example.mywebsite;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.widget.ProgressBar;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {

    private WebView myWeb;
    private ProgressBar progressBar;
    private ValueCallback<Uri[]> filePathCallback; // For file chooser
    private static final int FILECHOOSER_RESULTCODE = 1; // Result code for file chooser

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }
        setContentView(R.layout.activity_main);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        myWeb = findViewById(R.id.myWeb);
        progressBar = findViewById(R.id.progressBar);
        setupWebView();
        myWeb.loadUrl("http://pantrypal.fun/");
    }

    private void setupWebView() {
        WebSettings webSettings = myWeb.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        myWeb.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        myWeb.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (isExternalLink(url)) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
            }
        });

        // Enable the file chooser
        myWeb.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                MainActivity.this.filePathCallback = filePathCallback; // Store the callback
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*"); // Specify the type of files you want to allow
                startActivityForResult(Intent.createChooser(intent, "Choose File"), FILECHOOSER_RESULTCODE);
                return true;
            }
        });

        // Set a DownloadListener
        myWeb.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) -> {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(url));
            startActivity(intent); // Open the file in a browser or suitable app
        });
    }

    private boolean isExternalLink(String url) {
        return !url.startsWith("http://pantrypal.fun/");
    }

    @Override
    public void onBackPressed() {
        if (myWeb.canGoBack()) {
            myWeb.goBack(); // Go back in the WebView history
        } else {
            super.onBackPressed(); // Default behavior (exit activity)
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        myWeb.onPause(); // Pause WebView to improve performance
    }

    @Override
    protected void onResume() {
        super.onResume();
        myWeb.onResume(); // Resume WebView when the activity is resumed
    }

    @Override
    protected void onDestroy() {
        myWeb.destroy(); // Clean up resources
        super.onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILECHOOSER_RESULTCODE) {
            Uri[] result = null;
            if (resultCode == RESULT_OK) {
                if (data != null) {
                    // Get the file Uri(s)
                    if (data.getClipData() != null) {
                        int count = data.getClipData().getItemCount();
                        result = new Uri[count];
                        for (int i = 0; i < count; i++) {
                            result[i] = data.getClipData().getItemAt(i).getUri();
                        }
                    } else if (data.getData() != null) {
                        result = new Uri[]{data.getData()};
                    }
                }
            }
            filePathCallback.onReceiveValue(result); // Send the file Uri(s) back
            filePathCallback = null; // Clear the callback
        }
    }
}
