from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import CaseRequest, AttorneyApprovalRequest
from .serializers import CaseRequestSerializer, AttorneyApprovalRequestSerializer
from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer  # Add this import

class CaseRequestViewSet(viewsets.ModelViewSet):
    queryset = CaseRequest.objects.all()
    serializer_class = CaseRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'client':
            return CaseRequest.objects.filter(client=self.request.user)
        elif self.request.user.role == 'attorney':
            return CaseRequest.objects.filter(attorney=self.request.user)
        elif self.request.user.is_superuser:
            return CaseRequest.objects.all()
        return CaseRequest.objects.none()

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def handle(self, request, pk=None):
        case_request = self.get_object()
        if case_request.attorney != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        action = request.data.get('action')
        if action in ['accept', 'reject']:
            case_request.status = action + 'ed'
            case_request.save()
            return Response({'status': case_request.status})
        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

class AttorneySearchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.filter(role='attorney', is_approved=True)
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        query = self.request.query_params.get('q', '')
        location = self.request.query_params.get('location', '')
        expertise = self.request.query_params.get('expertise', '')
        if query:
            queryset = queryset.filter(email__icontains=query)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if expertise:
            queryset = queryset.filter(attorneyprofile__expertise=expertise)
        return queryset

class AttorneyApprovalRequestViewSet(viewsets.ModelViewSet):
    queryset = AttorneyApprovalRequest.objects.all()
    serializer_class = AttorneyApprovalRequestSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return AttorneyApprovalRequest.objects.all()

@api_view(['GET'])
def law_search(request):
    query = request.query_params.get('query', '')
    # Placeholder: Integrate with legal database or external API later
    return Response({'results': f'Placeholder law search results for: {query}'})

@api_view(['POST'])
def ai_bot(request):
    message = request.data.get('message', '')
    # Placeholder: Integrate with AI service (e.g., Grok) later
    return Response({'response': f'Placeholder AI response to: {message}'})