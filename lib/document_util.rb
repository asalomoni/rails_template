require 'pdf_tk_engine'

module DocumentUtil
  def self.merge_documents(files=[])
    return nil if files.blank?

    begin
      pdf_tk_engine = PdfTkEngine.new(eval('"' + APP_CONFIG['pdftk_path'] + '"'))
    rescue => e
      warn("PdkTkEngine error: #{e.exception}")
      return nil
    end

    pdf_tk_engine.merge(files)
  end

  def self.generate_pdf(resource, include_option, methods_option, template, file_name, file_path=nil, save=false)
    z = Intersail::Rpdf::ZapPdfClient.new(APP_CONFIG['pdf_url'])

    begin
      pdf_data = z.make_pdf_with_local_file template, resource, include: include_option || [], methods: methods_option || []

      if save
        path = file_path.join(file_name)
        File.delete path if File.exists?(path)

        File.atomic_write(path) do |f|
          f.write(pdf_data)
        end
      end

      pdf_data
    rescue
      return nil
    end
  end
end