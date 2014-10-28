class PdfTkEngine
  def initialize(pdftk_path)
    @@pdftk_path = pdftk_path
    raise "pdftk path is not valid" unless File.exist?(@@pdftk_path)
  end

  def merge(pdfs=[])
    return nil unless pdfs && pdfs.length > 0
    # creo una stringa che rappresenta il comando da chiamare:  %x("pdftk" "file1.pdf" "file2.pdf" cat output -)
    cmd = "%x(\"#{@@pdftk_path}\" #{normalize(pdfs).join(' ')} cat output -)"
    output = eval cmd
    return output if output && output != ""
  end

  private

  def normalize(pdfs)
    pdfs.inject([]) { |arr, pdf| arr << "\"#{pdf}\""; arr; }
  end
end