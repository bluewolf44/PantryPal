//
//  ContentView.swift
//  PantryPalApp
//
//  Created by Hamish Phillips on 24/09/2024.
//

import SwiftUI
import WebKit

struct ContentView: View {
    @State private var showWebView = false
    private let urlString : String = "http://localhost:8000/"
    
    var body: some View {
        VStack(spacing : 40) {
            WebView(url : URL(string : urlString)!).frame(height : 500.0)
                .cornerRadius(10)
                .shadow(color : .black.opacity(0.3), radius: 20.0, x:5, y:5)
            
            Link(destination : URL(string : urlString)!, label : {
                Text("Open a new window")
                    .foregroundColor(.blue)
            })
            
            Button("Open a sheet") {
                showWebView.toggle()
            }
            .sheet(isPresented: $showWebView){
                WebView(url : URL(string: urlString)!)
            }
            
            Spacer();
        }
    }
}

struct WebView : UIViewRepresentable {
    var url : URL
    func makeUIView(context : Context) -> WKWebView {
        return WKWebView()
    }
    
    func updateUIView (_ uiView: WKWebView, context : Context) {
        let request = URLRequest(url : url)
        uiView.load(request)
    }
}

#Preview {
    ContentView()
}
