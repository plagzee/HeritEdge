// app/api/analyze/route.js
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://rootsnroutes.vercel.app/analyze';

export async function POST(request) {
  try {
    // Get headers for file information
    const contentType = request.headers.get('content-type');
    const contentLength = request.headers.get('content-length');
    const fileName = request.headers.get('x-file-name') || 'uploaded-image';

    if (!contentType) {
      return NextResponse.json(
        { error: 'No content type provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a valid image file (JPEG, PNG, WebP, GIF).' },
        { status: 400 }
      );
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (contentLength && parseInt(contentLength) > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Please upload an image smaller than 10MB.' },
        { status: 400 }
      );
    }

    // Get the binary data from the request body
    const arrayBuffer = await request.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    if (imageBuffer.length === 0) {
      return NextResponse.json(
        { error: 'Empty file uploaded' },
        { status: 400 }
      );
    }

    // Create a Blob from the buffer to send to backend
    const imageBlob = new Blob([imageBuffer], { type: contentType });

    // Create FormData for the backend request (Flask expects FormData)
    const backendFormData = new FormData();
    backendFormData.append('image', imageBlob, fileName);

    // Make request to Flask backend
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      
      return NextResponse.json(
        { 
          error: 'Failed to analyze image',
          details: response.status === 500 ? 'Internal server error' : errorText
        },
        { status: response.status }
      );
    }

    // Parse the JSON response from Flask backend
    const result = await response.json();

    // Validate the response structure
    if (!result.languages) {
      console.error('Invalid response structure:', result);
      return NextResponse.json(
        { error: 'Invalid response from analysis service' },
        { status: 500 }
      );
    }

    // Return the structured response
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      metadata: {
        fileName: fileName,
        fileSize: imageBuffer.length,
        contentType: contentType
      }
    });

  } catch (error) {
    console.error('API Route Error:', error);
    
    // Handle specific error types
    if (error.name === 'SyntaxError') {
      return NextResponse.json(
        { error: 'Invalid response format from analysis service' },
        { status: 502 }
      );
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: 'Analysis service is currently unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Check if backend is available
    const healthCheck = await fetch(`${BACKEND_URL.replace('/analyze', '/health')}`, {
      method: 'GET',
    });

    const isBackendHealthy = healthCheck.ok;

    return NextResponse.json({
      status: isBackendHealthy ? 'healthy' : 'degraded',
      api: 'Next.js Translation API',
      backend: isBackendHealthy ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      api: 'Next.js Translation API',
      backend: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}