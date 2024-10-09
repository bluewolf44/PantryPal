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
    
    var body: some View {
        VStack {
            WebView(url: URL(string: urlString)!)
                .frame(maxWidth: .infinity, maxHeight: .infinity) // Fill the screen
                .edgesIgnoringSafeArea(.all) // Make the web view take up the entire space
        }
    }
}

struct WebView: UIViewRepresentable {
    var url: URL
    
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
        let request = URLRequest(url: url)
        uiView.load(request)
    }
}

#Preview {
    ContentView()
}

