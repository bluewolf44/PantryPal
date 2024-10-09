//
//  ContentView.swift
//  PantryPalApp
//
//  Created by Hamish Phillips on 24/09/2024.
//
import SwiftUI
import WebKit

struct ContentView: View {
    private let urlString: String = "https://www.nichols.co.nz/"
    @StateObject private var webViewModel = WebViewModel() // ViewModel to manage the WebView's state
    
    var body: some View {
        VStack {
            // WebView to display the webpage
            WebView(url: URL(string: urlString)!, webViewModel: webViewModel)
                .frame(maxWidth: .infinity, maxHeight: .infinity) // Fill the screen
                .edgesIgnoringSafeArea(.all) // Make the web view take up the entire space
            
            // Navigation buttons
            HStack {
                Button(action: {
                    webViewModel.goBack() // Go back action
                }) {
                    Text("Back")
                }
                .disabled(!webViewModel.canGoBack) // Disable if cannot go back
                
                Spacer()
                
                Button(action: {
                    webViewModel.goForward() // Go forward action
                }) {
                    Text("Forward")
                }
                .disabled(!webViewModel.canGoForward) // Disable if cannot go forward
            }
            .padding()
        }
    }
}

struct WebView: UIViewRepresentable {
    var url: URL
    @ObservedObject var webViewModel: WebViewModel // ObservedObject to sync with the ViewModel
    
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
        // Only load the request if the webView is nil (to avoid reloading)
        if webViewModel.webView == nil {
            let request = URLRequest(url: url)
            uiView.load(request)
            webViewModel.webView = uiView
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(webViewModel: webViewModel)
    }
    
    class Coordinator: NSObject, WKNavigationDelegate {
        var webViewModel: WebViewModel
        
        init(webViewModel: WebViewModel) {
            self.webViewModel = webViewModel
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            webViewModel.canGoBack = webView.canGoBack
            webViewModel.canGoForward = webView.canGoForward
        }
    }
}

class WebViewModel: ObservableObject {
    @Published var canGoBack = false
    @Published var canGoForward = false
    var webView: WKWebView?
    
    func goBack() {
        webView?.goBack()
    }
    
    func goForward() {
        webView?.goForward()
    }
}

#Preview {
    ContentView()
}
